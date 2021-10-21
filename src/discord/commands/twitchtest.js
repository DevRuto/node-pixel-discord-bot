const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('twitchtest')
    .setDescription('Test guild values'),

  async execute(interaction) {
    const guild = (await Guild.findOrCreate({
      where: { id: interaction.guildId },
      defaults: {
        id: interaction.guildId
      }
    }))[0];

    let msg = 'Bot settings:\n';
    if (guild.adminRole) {
      msg += `Admin Role: <@${guild.adminRole}>\n`;
    }
    if (guild.streamChannel) {
      msg += `Stream Channel: <#${guild.streamChannel}>\n`;
    }
    if (guild.streamPing) {
      msg += `Stream Ping: <@${guild.streamPing}>\n`;
    }
    if (guild.vodChannel) {
      msg += `VOD Channel: <#${guild.vodChannel}>\n`;
    }
    if (guild.vodPing) {
      msg += `VOD Ping: <@${guild.vodPing}>\n`;
    }

    interaction.reply({
      content: msg,
      allowedMentions: { parse: [] },
      ephemeral: false
    });
  }
};
