const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstreamping')
    .setDescription('Set the role to ping when a streamer goes live')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('The role to ping for live streams')
        .setRequired(true)),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const role = interaction.options.getRole('role');
    guild.streamPing = role.id;
    if (role.name === '@everyone') {
      guild.streamPing = 'everyone';
    }
    await guild.save();
    await interaction.reply({
      content: `Saved stream ping role as ${role}`,
      allowedMentions: { parse: [] },
      ephemeral: false
    });
  }
};
