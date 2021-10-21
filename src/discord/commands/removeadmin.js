const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeadmin')
    .setDescription('Remove admin for the bot'),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    guild.adminRole = null;
    await guild.save();
    await interaction.reply({
      content: 'Admin role removed',
      ephemeral: false
    });
  }
};
