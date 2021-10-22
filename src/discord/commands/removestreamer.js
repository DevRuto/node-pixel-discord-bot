const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild, TwitchUser } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removestreamer')
    .setDescription('Remove streamer from watch list')
    .addStringOption(option =>
      option
        .setName('streamer')
        .setDescription('Twitch name for streamer')
        .setRequired(true)),

  async execute(interaction) {
    const streamer = interaction.options.getString('streamer').toLowerCase().trim();
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];
    const twitchUser = await TwitchUser.findOne({
      where: {
        name: streamer
      }
    });
    if (!twitchUser) {
      await interaction.reply({
        content: 'Cannot find streamer',
        ephemeral: false
      });
      return;
    }
    if (!await twitchUser.hasGuilds()) {
      await require('../../twitch/twitch').unsubscribe(streamer);
    }

    await guild.removeSubscription(twitchUser);
    await interaction.reply({
      content: 'Removed streamer',
      ephemeral: false
    });
  }
};
