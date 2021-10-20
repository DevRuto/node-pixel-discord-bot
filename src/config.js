const twitch = {
  client_id: '',
  client_secret: '',
  secret: 'thisisasecret',
  devMode: true, // Sets twitch listener to NgrokAdapter
  hostname: 'example.com' // Not used of devMode is true
};

const discord = {
  token: ''
};

module.exports = {
  twitch,
  discord
};
