const twitch = require('./twitch/twitch');
const discord = require('./discord/discord');
const db = require('./db');

async function main() {
  await db.setup();
  await twitch.start();
  await discord.start();
}

main();
