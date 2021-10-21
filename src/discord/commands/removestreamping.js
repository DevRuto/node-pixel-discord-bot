const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removestreamping')
    .setDescription('Removes role pinging for live streams'),

  async execute(interaction) {
    const guild = await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    });
    guild.streamPing = null;
    await guild.save();
    await interaction.reply({
      content: 'Removed stream ping role',
      ephemeral: false
    });
  }
};
