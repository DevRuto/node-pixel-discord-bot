
async function streamLiveCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
  const stream = await event.getStream();
  console.log(`${event.broadcasterDisplayName} has went online [${stream.title}]`);
}

async function streamOfflineCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOfflineEvent.html
  console.log(`${event.broadcasterDisplayName} has went offline`);
}

async function streamUpdateCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubChannelUpdateEvent.html
  console.log(`${event.broadcasterDisplayName} has updated the stream info`);
}

module.exports = {
  streamLiveCallback,
  streamOfflineCallback,
  streamUpdateCallback
};
