const { client } = require('./discord');
const { DiscordMessage, TwitchUser } = require('../db');
const { createLiveEmbed, createUpdateEmbed } = require('./embed');

// https://twurple.js.org/reference/eventsub/classes/EventSubStreamOnlineEvent.html
async function handleStreamLive(e) {
  if (!client || !client.isReady()) {
    return;
  }

  const twitchUser = await TwitchUser.findByPk(e.broadcasterId);
  if (!twitchUser) {
    return;
  }

  const guilds = await twitchUser.getGuilds();
  for (const guild of guilds) {
    if (!guild || !guild.streamChannel) {
      continue;
    }
    const channel = await client.channels.fetch(guild.streamChannel);
    if (!channel) {
      continue;
    }
    let ping = '';
    if (guild.streamPing) {
      if (guild.streamPing === 'everyone') {
        ping += '@everyone';
      } else {
        ping += `<@&${guild.streamPing}>`;
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
async function handleStreamOffline(e) {
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
}

module.exports = {
  handleStreamLive,
  handleStreamUpdate,
  handleStreamOffline
};
