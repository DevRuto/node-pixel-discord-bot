const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const { discord } = require('../config');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  console.log(`[DISCORD] Loaded '${command.data.name}' command`);
}

async function start() {
  client.once('ready', () => {
    console.log('[DISCORD] Start Discord Bot');
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

  await client.login(discord.token);
}

module.exports = {
  start,
  client
};
