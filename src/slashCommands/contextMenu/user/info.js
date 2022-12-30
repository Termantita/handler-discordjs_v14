const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
} = require("@discordjs/builders");

const Client = require("../../../structures/Client");
const {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  ISCTXMENU: true,
  CMD: new ContextMenuCommandBuilder().setType(ApplicationCommandType.User),

  /**
   * @param {Client} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setTitle(`Perfil de ${interaction.user.username}`)
      .setColor(client.color)
      .addFields(
        { name: "Nombre", value: interaction.user.username },
        {
          name: "Nombre con tag",
          value: interaction.user.tag,
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL());

    return await interaction.reply({ embeds: [embed] });
  },
};
