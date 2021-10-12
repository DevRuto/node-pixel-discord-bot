import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { streamLiveCallback, streamOfflineCallback, streamUpdateCallback } from './callback.js'
import { twitch } from '../config.js';

const authProvider = new ClientCredentialsAuthProvider(twitch.client_id, twitch.client_secret);
const apiClient = new ApiClient({ authProvider });
let listener;

async function start() {
  console.log('start twitch listener');

  // const adapter = new DirectConnectionAdapter({
  // 	hostName: 'example.com',
  // });
  const adapter = new NgrokAdapter();
  const secret = 'asdfasdfasdf';
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

export default {
  start,
  subscribe
}
