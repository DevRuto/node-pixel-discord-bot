const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { streamLiveCallback, streamOfflineCallback, streamUpdateCallback } = require('./callback');
const { twitch } = require('../config');

const authProvider = new ClientCredentialsAuthProvider(twitch.client_id, twitch.client_secret);
const apiClient = new ApiClient({ authProvider });
let listener;

async function start() {
  console.log('[TWITCH] Start EventSub Listener');

  // const adapter = new DirectConnectionAdapter({
  // 	hostName: 'example.com',
  // });
  const adapter = new NgrokAdapter();
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
    await listener.subscribeToStreamOnlineEvents(userId, streamLiveCallback);
    await listener.subscribeToStreamOfflineEvents(userId, streamOfflineCallback);
    await listener.subscribeToChannelUpdateEvents(userId, streamUpdateCallback);
  } catch {
    return false;
  }
  return true;
}

module.exports = {
  start,
  subscribe
};
