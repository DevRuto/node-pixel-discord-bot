// https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { discord } = require('../config');

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

const clientId = discord.client_id;
const guildId = discord.guild_id;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(`[DISCORD:DEPLOY] Registered '${command.data.name}'`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(discord.token);

(async () => {
  try {
    console.log(`Started refreshing application slash commands (${commands.length})`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
