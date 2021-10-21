const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setadmin')
    .setDescription('Set admin for the bot')
    .addMentionableOption(option =>
      option
        .setName('role')
        .setDescription('Admin role')
        .setRequired(true)),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const mention = interaction.options.getMentionable('role');
    guild.adminRole = mention.id;
    await guild.save();
    await interaction.reply({
      content: 'Admin role set',
      ephemeral: false
    });
  }
};
