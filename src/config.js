const twitch = {
  client_id: '',
  client_secret: '',
  secret: 'thisisasecret',
  devMode: true, // Sets twitch listener to NgrokAdapter
  hostname: 'example.com' // Not used of devMode is true
};

const discord = {
  token: '',
  client_id: '',
  // Guild ID is for local testing in discord/deploy-commands.js
  guild_id: '793736735711952909'
};

module.exports = {
  twitch,
  discord
};
