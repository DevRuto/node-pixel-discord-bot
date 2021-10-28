const { SlashCommandBuilder } = require('@discordjs/builders');
const { createLiveEmbed } = require('../embed');

const streamObj = {
  gameId: '4321',
  gameName: 'OSRS',
  id: '1234',
  isMature: false,
  language: 'english',
  startDate: new Date(),
  tagIds: ['12','32'],
  thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_auronplay-{width}x{height}.jpg',
  title: 'a title',
  type: 'live',
  userDisplayName: 'Ruto',
  userId: '123',
  userName: 'ruto',
  viewers: 1
};

const broadcasterObj = {
  broadcasterType: '',
  creationDate: new Date(),
  description: 'desc',
  displayName: 'Ruto',
  id: '123',
  name: 'ruto',
  offlinePlaceholderUrl: '',
  profilePictureUrl: '',
  type: '',
  views: 10000
};

const liveEvent = {
  broadcasterDisplayName: 'Ruto',
  broadcasterId: '123',
  broadcasterName: 'ruto',
  startDate: new Date(),
  streamType: 'live',
  getStream: () => Promise.resolve(streamObj),
  getBroadcaster: () => Promise.resolve(broadcasterObj)
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('twitchembed')
    .setDescription('Show embeds for Stream and VODs'),

  async execute(interaction) {
    await interaction.reply({
      embeds: [await createLiveEmbed(liveEvent)],
      ephemeral: false
    });
  }
};
