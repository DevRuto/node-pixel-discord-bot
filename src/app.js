const twitch = require('./twitch/twitch');
const discord = require('./discord/discord');

async function main() {
  await twitch.start();
  await discord.start();
}

main();
