const { SlashCommandBuilder } = require("@discordjs/builders");

const { CommandInteraction } = require('discord.js');
const Client = require("../../structures/Client");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription(
    "Te permite ver el ping del bot"
  ),

  /**
   * @param { Client } client 
   * @param { CommandInteraction } interaction
   */
  async execute(client, interaction) {
    return await interaction.reply(`${client.ws.ping}ms`);
  },
};
