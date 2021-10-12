
async function streamLiveCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
  const stream = await event.getStream();
  console.log(`${event.broadcasterDisplayName} has went online [${stream.title}]`);
}

async function streamOfflineCallback(event) {
  // https://twurple.js.org/reference/eventsub/classes/EventSubStreamOfflineEvent.html
  console.log(`${event.broadcasterDisplayName} has went offline`);
}

export {
  streamLiveCallback,
  streamOfflineCallback
}
