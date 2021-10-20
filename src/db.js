const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Guild = sequelize.define('guild', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  adminRole: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  streamChannel: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  vodChannel: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
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

Guild.belongsToMany(TwitchUser, { through: 'GuildSubscriptions' });
TwitchUser.belongsToMany(Guild, { through: 'GuildSubscriptions' });

(async () => {
  await sequelize.sync();
  console.log('[DB] Tables synced');
})();

module.exports = {
  sequelize,
  Guild,
  TwitchUser
};
