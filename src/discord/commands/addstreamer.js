const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild, TwitchUser } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addstreamer')
    .setDescription('Add streamer from watch list')
    .addStringOption(option =>
      option
        .setName('streamer')
        .setDescription('Twitch name for streamer')
        .setRequired(true)),

  async execute(interaction) {
    const streamer = interaction.options.getString('streamer').toLowerCase();
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const twitchUser = (await TwitchUser.findOrCreate({
      where: {
        name: streamer
      },
      defaults: {
        id: await require('../../twitch/twitch').getUserId(streamer),
        name: streamer
      }
    }))[0];
    await require('../../twitch/twitch').subscribe(streamer);
    await guild.addSubscription(twitchUser);
    await interaction.reply({
      content: 'Added streamer',
      ephemeral: false
    });
  }
};
