const { MessageEmbed } = require('discord.js');

const dateOptions =  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
    .addField('Title', stream.title, false)
    .addField('Game', stream.gameName, true)
    .setURL(`https://twitch.tv/${liveEvent.broadcasterName}`)
    .setImage(stream.getThumbnailUrl(640, 360))
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
    .addField('Title', updateEvent.streamTitle, false)
    .addField('Game', stream.gameName, true)
    .setURL(`https://twitch.tv/${updateEvent.broadcasterName}`)
    .setImage(stream.getThumbnailUrl(640, 360))
    .setTimestamp();
}

// https://twurple.js.org/reference/api/classes/HelixVideo.html
/**
  creationDate
  description
  duration
  durationInSeconds
  id
  isPublic
  language
  mutedSegmentData
  publishDate
  streamId
  thumbnailUrl
  title
  type
  url
  userDisplayName
  userId
  userName
  views
  -> getUser()
 */
async function createVodEmbed(vod) {
  return new MessageEmbed()
    .setTitle(vod.userDisplayName)
    .addField('Title', vod.title, false)
    .addField('Date', vod.creationDate.toLocaleDateString('en-US', dateOptions), true)
    .addField('Duration', vod.duration, true)
    .setURL(vod.url)
    .setImage(vod.thumbnailUrl.replace('{width}', '640').replace('{height}', '360'));
}

module.exports = {
  createLiveEmbed,
  createUpdateEmbed,
  createVodEmbed
};
