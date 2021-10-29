const { MessageEmbed } = require('discord.js');

// https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
/**
  broadcasterDisplayName
  broadcasterId
  broadcasterName
  startDate
  streamType
  -> getStream()
  -> getBroadcaster()
 */
async function createLiveEmbed(liveEvent) {
  const stream = await liveEvent.getStream();
  return new MessageEmbed()
    .setTitle(liveEvent.broadcasterDisplayName)
    .addField('Title', stream.title, true)
    .addField('Game', stream.gameName, true)
    .setURL(`https://twitch.tv/${liveEvent.broadcasterName}`)
    .setImage(stream.thumbnailUrl.replace('{width}', '640').replace('{height}', '360'))
    .setColor()
    .setTimestamp();
}


// https://twurple.js.org/reference/eventsub/classes/EventSubChannelUpdateEvent.html
/**
  broadcasterDisplayName
  broadcasterId
  broadcasterName
  categoryId
  categoryName
  isMature
  streamLanguage
  streamTitle
  -> getGame()
  -> getBroadcaster()
 */
async function createUpdateEmbed(updateEvent) {
  const broadcaster = await updateEvent.getBroadcaster();
  const stream = await broadcaster.getStream();
  return new MessageEmbed()
    .setTitle(updateEvent.broadcasterDisplayName)
    .addField('Title', updateEvent.streamTitle, true)
    .addField('Game', stream.gameName, true)
    .setURL(`https://twitch.tv/${updateEvent.broadcasterName}`)
    .setImage(stream.thumbnailUrl.replace('{width}', '640').replace('{height}', '360'))
    .setTimestamp();
}

module.exports = {
  createLiveEmbed,
  createUpdateEmbed
};
