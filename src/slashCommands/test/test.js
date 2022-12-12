const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
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

    await interaction.deferReply();
    await interaction.followUp({
      embeds: [new EmbedBuilder().addFields({ name: "Page 1", value: "Line 1" })],
      components: [row],
    });

    /**
     * @param {ButtonInteraction} button
     **/
    
    // await row.components.map(btn => btn.data.required = true);
  },
};
