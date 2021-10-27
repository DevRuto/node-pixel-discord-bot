const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { ReverseProxyAdapter, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { twitch } = require('../config');

const authProvider = new ClientCredentialsAuthProvider(twitch.client_id, twitch.client_secret);
const apiClient = new ApiClient({ authProvider });
let listener;

async function start() {
  console.log('[TWITCH TEST] Start EventSub Listener');

  const adapter = twitch.devMode ? new NgrokAdapter() : new ReverseProxyAdapter({
    hostName: twitch.hostname,
    port: twitch.port,
    pathPrefix: twitch.prefix,
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

async function followCallback(e) {
  console.log(`[TWITCH TEST] ${e.userName} has followed ${e.broadcasterDisplayName}`);
}

async function subscribe(name) {
  try {
    const userId = await getUserId(name);
    if (!userId) {
      return false;
    }
    console.log(`[TWITCH TEST] Subscribing to ${name} (${userId})`);

    await listener.subscribeToChannelFollowEvents(userId, followCallback);
  } catch {
    return false;
  }
  return true;
}

(async () => {
  await start();
  await subscribe('twitch');
})();
