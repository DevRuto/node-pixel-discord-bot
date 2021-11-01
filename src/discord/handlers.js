const { client } = require('./discord');
const { DiscordMessage, TwitchUser } = require('../db');
const { createLiveEmbed, createUpdateEmbed, createVodEmbed } = require('./embed');

// https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
async function handleStreamLive(e) {
  if (!client || !client.isReady()) {
    return;
  }

  const twitchUser = await TwitchUser.findByPk(e.broadcasterId);
  if (!twitchUser) {
    return;
  }

  // Delete any existing stream messages, simulate offline event
  await handleStreamOffline({
    broadcasterId: e.broadcasterId
  });

  const guilds = await twitchUser.getGuilds();
  for (const guild of guilds) {
    if (!guild || !guild.streamChannel) {
      continue;
    }
    const channel = await client.channels.fetch(guild.streamChannel);
    if (!channel) {
      continue;
    }
    let ping = null;
    if (guild.streamPing) {
      if (guild.streamPing === 'everyone') {
        ping = '@everyone';
      } else {
        ping = `<@&${guild.streamPing}>`;
      }
    }
    const message = await channel.send({
      content: ping,
      embeds: [await createLiveEmbed(e)]
    });
    await DiscordMessage.create({
      discordChannel: channel.id,
      twitchId: e.broadcasterId,
      message: message.id
    });
  }
}

// https://twurple.js.org/reference/eventsub/classes/EventSubChannelUpdateEvent.html
async function handleStreamUpdate(e) {
  if (!client || !client.isReady()) {
    return;
  }

  const messages = await DiscordMessage.findAll({
    where: {
      twitchId: e.broadcasterId
    }
  });

  for (const msg of messages) {
    const channel = await client.channels.fetch(msg.discordChannel);
    const message = await channel.messages.fetch(msg.message);
    if (message && !message.deleted) {
      await message.edit({
        embeds: [await createUpdateEmbed(e)]
      });
    }
  }
}

// https://twurple.js.org/reference/eventsub/classes/EventSubStreamOfflineEvent.html
/**
  broadcasterDisplayName
  broadcasterId
  broadcasterName
  -> getBroadcaster()
 */
async function handleStreamOffline(e, vod) {
  if (!client || !client.isReady()) {
    return;
  }

  const messages = await DiscordMessage.findAll({
    where: {
      twitchId: e.broadcasterId
    }
  });

  for (const msg of messages) {
    const channel = await client.channels.fetch(msg.discordChannel);
    const message = await channel.messages.fetch(msg.message);
    if (message && !message.deleted) {
      await message.delete();
    }
  }

  await DiscordMessage.destroy({
    where: {
      twitchId: e.broadcasterId
    }
  });

  // Send VOD if enabled
  if (!vod || !vod.isPublic) {
    return;
  }

  const twitchUser = await TwitchUser.findByPk(e.broadcasterId);
  if (!twitchUser) {
    return;
  }

  const guilds = await twitchUser.getGuilds();
  for (const guild of guilds) {
    if (!guild || !guild.vodChannel) {
      continue;
    }
    const channel = await client.channels.fetch(guild.vodChannel);
    if (!channel) {
      continue;
    }
    let ping = null;
    if (guild.vodPing) {
      if (guild.vodPing === 'everyone') {
        ping = '@everyone';
      } else {
        ping = `<@&${guild.vodPing}>`;
      }
    }
    await channel.send({
      content: ping,
      embeds: [await createVodEmbed(vod)]
    });
  }
}

module.exports = {
  handleStreamLive,
  handleStreamUpdate,
  handleStreamOffline
};
