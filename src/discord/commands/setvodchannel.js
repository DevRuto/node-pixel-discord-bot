const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setvodchannel')
    .setDescription('Set the channel to post VODs')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to post VODs')
        .setRequired(true)),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    guild.vodChannel = interaction.options.getChannel('channel').id;
    await guild.save();
    await interaction.reply({
      content: 'Saved VOD channel',
      ephemeral: false
    });
  }
};