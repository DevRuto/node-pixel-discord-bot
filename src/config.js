const twitch = {
  client_id: '',
  client_secret: '',
  secret: 'thisisasecret',
  devMode: true, // Sets twitch listener to NgrokAdapter
  hostname: 'example.com', // Not used of devMode is true
  port: 4321,
  prefix: '' // Prefix from the reverse proxy to this app, if any
};

const discord = {
  token: '',
  client_id: '',
  // Guild ID is for local testing in discord/deploy-commands.js
  guild_id: ''
};

module.exports = {
  twitch,
  discord
};
