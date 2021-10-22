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
    const streamer = interaction.options.getString('streamer').toLowerCase().trim();
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const result = await TwitchUser.findOrCreate({
      where: {
        name: streamer
      },
      defaults: {
        id: await require('../../twitch/twitch').getUserId(streamer),
        name: streamer
      }
    });
    const twitchUser = result[0];
    if (result[1]) {
      await require('../../twitch/twitch').subscribe(streamer);
      await guild.addSubscription(twitchUser);
      await interaction.reply({
        content: `Added streamer ${streamer}`,
        ephemeral: false
      });
    } else {
      await interaction.reply({
        content: `Streamer '${streamer}' is already in your watch list`,
        ephemeral: false
      });
    }
  }
};
