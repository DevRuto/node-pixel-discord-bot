const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { DirectConnectionAdapter, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { streamLiveCallback, streamOfflineCallback, streamUpdateCallback } = require('./callback');
const { twitch } = require('../config');

const authProvider = new ClientCredentialsAuthProvider(twitch.client_id, twitch.client_secret);
const apiClient = new ApiClient({ authProvider });
let listener;

const subscriptionCache = {};

async function start() {
  console.log('[TWITCH] Start EventSub Listener');

  const adapter = twitch.devMode ? new NgrokAdapter() : new DirectConnectionAdapter({
    hostName: twitch.hostname,
  });
  const secret = twitch.secret;
  listener = new EventSubListener({ apiClient, adapter, secret });
  await listener.listen();
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
    console.log(`[TWITCH] Subscribing to ${name} (${userId})`);

    if (!subscriptionCache[userId]) {
      subscriptionCache[userId] = [];
      subscriptionCache[userId].push(await listener.subscribeToStreamOnlineEvents(userId, streamLiveCallback));
      subscriptionCache[userId].push(await listener.subscribeToStreamOfflineEvents(userId, streamOfflineCallback));
      subscriptionCache[userId].push(await listener.subscribeToChannelUpdateEvents(userId, streamUpdateCallback));
    }
  } catch {
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

    for (const sub in subscriptionCache[userId]) {
      sub.stop();
    }
    delete subscriptionCache[userId];
  } catch {
    return false;
  }
  return true;
}

module.exports = {
  start,
  subscribe,
  unsubscribe,
  getUserId
};
