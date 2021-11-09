const {
  handleStreamLive,
  handleStreamUpdate,
  handleStreamOffline
} = require('../discord/handlers');
// const { getLatestVod } = require('./twitch');

async function streamLiveCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
  console.log(`[TWITCH] ${event.broadcasterDisplayName} has went online`);
  handleStreamLive(event);
}

async function streamOfflineCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOfflineEvent.html
  console.log(`[TWITCH] ${event.broadcasterDisplayName} has went offline`);
  // const vod = await getLatestVod(event.broadcasterId);
  // console.log(vod);
  handleStreamOffline(event, false);
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
