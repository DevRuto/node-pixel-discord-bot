const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removevodchannel')
    .setDescription('Remove the channel for posting VODs'),

  async execute(interaction) {
    const guild = await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    });
    guild.vodChannel = null;
    await guild.save();
    await interaction.reply({
      content: 'Removed vod channel',
      ephemeral: false
    });
  }
};
