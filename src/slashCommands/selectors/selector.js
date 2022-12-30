const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  SlashCommandBuilder,
} = require("@discordjs/builders");

const Client = require("../../structures/Client");
const { CommandInteraction, ComponentType } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription(
    "Demostración de un selector o SelectMenu"
  ),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const selectMenu = new StringSelectMenuBuilder()
      .setMinValues(2)
      .setMaxValues(2)
      .setCustomId("selector")
      .setOptions([
        {
          label: "Owner",
          value: "owner",
          emoji: { name: "😎" },
          description: "Básicamente puedes hacer lo que quieras",
        },
        {
          label: "Admin",
          value: "admin",
          emoji: { name: "🔐" },
          description: "Tu trabajo es moderar este servidor",
        },
        {
          label: "User",
          value: "user",
          emoji: { name: "👤" },
          description:
            "Solo un simple usuario en el servidor sin permisos administrativos",
        },
      ]);

    const selected = await interaction.reply({
      components: [new ActionRowBuilder().setComponents(selectMenu)],
    });

    const collector = selected.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 10000,
      filter: (u) => u.user.id === interaction.user.id,
    });

    collector.on("collect", async (opt) => {
      console.log({ opt });
      return await opt.reply(`Has elegido: ${opt.values}`);
    });
  },
};
