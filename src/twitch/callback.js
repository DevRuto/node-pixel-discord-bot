const {
  handleStreamLive,
  handleStreamUpdate,
  handleStreamOffline
} = require('../discord/handlers');

async function streamLiveCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
  console.log(`[TWITCH] ${event.broadcasterDisplayName} has went online`);
  handleStreamLive(event);
}

async function streamOfflineCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOfflineEvent.html
  console.log(`[TWITCH] ${event.broadcasterDisplayName} has went offline`);
  handleStreamOffline(event);
}

async function streamUpdateCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubChannelUpdateEvent.html
  console.log(`[TWITCH] ${event.broadcasterDisplayName} has updated the stream info`);
  handleStreamUpdate(event);
}

module.exports = {
  streamLiveCallback,
  streamOfflineCallback,
  streamUpdateCallback
};
