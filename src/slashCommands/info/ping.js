const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  CMD: new SlashCommandBuilder().setDescription('Te permite ver el ping del bot'),
  async execute(client, interaction, args, prefix) {
    return await interaction.reply(`${client.ws.ping}ms`);
  },
}