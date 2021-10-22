const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setvodping')
    .setDescription('Set the role to ping for VOD when a streamer goes offline')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('The role to ping for VODs')
        .setRequired(true)),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const role = interaction.options.getRole('role');
    guild.vodPing = role.id;
    if (role.name === '@everyone') {
      guild.vodPing = 'everyone';
    }
    await guild.save();
    await interaction.reply({
      content: `Saved VOD ping role ${role}`,
      ephemeral: false
    });
  }
};
