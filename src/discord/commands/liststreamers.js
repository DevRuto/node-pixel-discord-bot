const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('liststreamers')
    .setDescription('List streamers in the watch list'),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const users = await guild.getSubscription();
    if (users && users.length > 0) {
      const strUsers = '**Watch List**\n```' + users.map(user => user.name).join(', ') + '```';
      await interaction.reply({
        content: strUsers,
        ephemeral: false
      });
    } else {
      await interaction.reply({
        content: 'No streamers in the watch list',
        ephemeral: false
      });
    }
  }
};
