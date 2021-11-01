const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { ReverseProxyAdapter, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { streamLiveCallback, streamOfflineCallback, streamUpdateCallback } = require('./callback');
const { twitch } = require('../config');
const { TwitchUser } = require('../db');

const authProvider = new ClientCredentialsAuthProvider(twitch.client_id, twitch.client_secret);
const apiClient = new ApiClient({ authProvider });
let listener;

const subscriptionCache = {};

async function start() {
  console.log('[TWITCH] Deleting any existing subscription');
  await apiClient.eventSub.deleteAllSubscriptions();
  console.log('[TWITCH] Starting EventSub Listener');

  const adapter = twitch.devMode ? new NgrokAdapter() : new ReverseProxyAdapter({
    hostName: twitch.hostname,
    port: twitch.port,
    pathPrefix: twitch.prefix,
  });
  const secret = twitch.secret;
  listener = new EventSubListener({ apiClient, adapter, secret });
  await listener.listen();

  const users = await TwitchUser.findAll();
  for (const user of users) {
    await subscribe(user.name);
  }
}

async function getUserId(name) {
  const user = await apiClient.users.getUserByName(name);
  if (!user) {
    return null;
  }
  return user.id;
}

async function subscribe(name) {
  try {
    const userId = await getUserId(name);
    if (!userId) {
      return false;
    }

    if (!subscriptionCache[userId]) {
      subscriptionCache[userId] = [];
      subscriptionCache[userId].push(await listener.subscribeToStreamOnlineEvents(userId, streamLiveCallback));
      subscriptionCache[userId].push(await listener.subscribeToStreamOfflineEvents(userId, streamOfflineCallback));
      subscriptionCache[userId].push(await listener.subscribeToChannelUpdateEvents(userId, streamUpdateCallback));
    }
    console.log(`[TWITCH] Subscribing to ${name} (${userId}) - ${subscriptionCache[userId][0].verified}`);
  } catch {
    console.log(`[TWITCH] Subscribing to ${name} - failed`);
    return false;
  }
  return true;
}

async function unsubscribe(name) {
  try {
    const userId = await getUserId(name);
    if (!userId || !subscriptionCache[userId]) {
      return false;
    }
    console.log(`[TWITCH] Unsubscribing ${name} (${userId})`);

    for (const sub of subscriptionCache[userId]) {
      await sub.stop();
    }
    delete subscriptionCache[userId];
  } catch {
    return false;
  }
  return true;
}

async function getLatestVod(userId) {
  try {
    const vods = await apiClient.videos.getVideosByUser(userId, {
      limit: 1,
      type: 'archive',
    });
    return vods.data[0];
  } catch {
    return false;
  }
}

module.exports = {
  start,
  subscribe,
  unsubscribe,
  getUserId,
  getLatestVod
};
