const { SlashCommandBuilder } = require('discord.js');
const Client = require('../../structures/Client');

module.exports = {
  CMD: new SlashCommandBuilder().setDescription('Te permite ver el ping del bot'),
  async execute(client, interaction) {
    return await interaction.reply(`${client.ws.ping}ms`);
  },
}