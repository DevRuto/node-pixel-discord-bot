const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Guild = sequelize.define('guild', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  adminRole: {
    type: DataTypes.STRING,
    allowNull: true
  },
  streamChannel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  streamPing: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vodChannel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vodPing: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const TwitchUser = sequelize.define('twitchUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
  },
});

const DiscordMessage = sequelize.define('discordMessage', {
  discordChannel: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  twitchId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  message: {
    type: DataTypes.STRING,
    primaryKey: true
  }
});

Guild.belongsToMany(TwitchUser, { through: 'GuildSubscriptions', as: 'Subscription' });
TwitchUser.belongsToMany(Guild, { through: 'GuildSubscriptions' });

async function setup() {
  await sequelize.sync();
  console.log('[DB] Tables synced');
}

module.exports = {
  sequelize,
  setup,
  Guild,
  TwitchUser,
  DiscordMessage
};
