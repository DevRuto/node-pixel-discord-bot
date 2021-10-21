const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstreamchannel')
    .setDescription('Set the channel to post live streams')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to post live streams')
        .setRequired(true)),

  async execute(interaction) {
    const guild = await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    });
    guild.streamChannel = interaction.option.getMentionable('channel').value;
    await guild.save();
    await interaction.reply({
      content: 'Saved stream channel',
      ephemeral: false
    });
  }
};
