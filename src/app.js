// const { REST, Routes } = require('discord.js');
// const { Client, GatewayIntentBits } = require('discord.js');
// require('dotenv').config()

// const token = process.env.TOKEN
// const appId = process.env.APP_ID

// const commands = [
//   {
//     name: 'ping',
//     description: 'Replies with Pong!',
//   },
//   {
//     name: 'login',
//     description: 'Login',
//   },
// ];

// const rest = new REST({ version: '10' }).setToken(token);

// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(Routes.applicationCommands(appId), { body: commands });

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on('interactionCreate', async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }
// });

// client.login(token);

require("dotenv").config();
require("colors");

const Bot = require("./structures/Client");

console.clear();
new Bot();
