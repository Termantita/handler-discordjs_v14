const { ContextMenuCommandBuilder } = require("@discordjs/builders");

const Client = require('../structures/Client');
const { ContextMenuCommandInteraction ,ApplicationCommandType } = require('discord.js');

module.exports = {
  CMD: new ContextMenuCommandBuilder().setType(ApplicationCommandType.Message),

  /**
  * @param {Client} client
  * @param {ContextMenuCommandInteraction} interaction
  */
  async execute(client, interaction) {
    await interaction.reply({content: 'Hello!'});
  }
}