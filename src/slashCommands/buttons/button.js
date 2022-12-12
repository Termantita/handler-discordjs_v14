const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
  ButtonBuilder,
  ActionRowBuilder
} = require("discord.js");
const User = require("../../models/user");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription(
    "Lista los registros guardados en la base de datos"
  ),
  
    /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary),
      // .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
      // .setDisabled(true)
    );

    await interaction.reply({components: [row]});
  }
}
