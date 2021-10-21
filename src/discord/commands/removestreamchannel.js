const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removestreamchannel')
    .setDescription('Remove the channel for posting live streams'),

  async execute(interaction) {
    const guild = await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    });
    guild.streamChannel = null;
    await guild.save();
    await interaction.reply({
      content: 'Removed stream channel',
      ephemeral: false
    });
  }
};
