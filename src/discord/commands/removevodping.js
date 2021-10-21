const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removevodping')
    .setDescription('Removes role pinging for VODs'),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    guild.vodPing = null;
    await guild.save();
    await interaction.reply({
      content: 'Removed VOD ping role',
      ephemeral: false
    });
  }
};
