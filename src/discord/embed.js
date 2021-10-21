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
    .addField('Type', liveEvent.streamType)
    .addField('Title', stream.title)
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
  return new MessageEmbed()
    .setTitle(updateEvent.broadcasterDisplayName)
    .addField('Title', updateEvent.streamTitle)
    .setTimestamp();
}

module.exports = {
  createLiveEmbed,
  createUpdateEmbed
};
