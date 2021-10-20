const { Guild, TwitchUser } = require('../db');
const twitch = require('../twitch/twitch');

async function subscribeStreamer(discordGuildId, twitchName) {
  const guild = await Guild.findOrCreate({
    where: { id: discordGuildId }
  });

  let twitchUser = await TwitchUser.findOne({
    where: { name: twitchName }
  });

  if (twitchUser === null) {
    twitchUser = await TwitchUser.create({
      id: await twitch.getUserId(twitchName),
      name: twitchName
    });
    await twitch.subscribe(twitchName);
  }

  if (!await guild.hasSubscription(twitchUser)) {
    guild.addSubscription(twitchUser);
  }
  return true;
}

async function removeStreamer(discordGuildId, twitchName) {
  const guild = await Guild.findByPk(discordGuildId);
  if (guild === null) {
    return false;
  }

  const twitchUser = await TwitchUser.findOne({
    where: { name: twitchName }
  });

  if (twitchUser === null) {
    return false;
  }

  await guild.removeSubscription(twitchUser);
  if (await twitchUser.countGuilds() === 0) {
    await twitch.unsubscribe(twitchName);
    await twitchUser.destroy();
  }
}

module.exports = {
  subscribeStreamer,
  removeStreamer
};
