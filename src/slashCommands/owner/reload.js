const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const { CommandInteraction } = require("discord.js");
const Client = require("../../structures/Client");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Registra el mensaje que vos quieras en una base de datos")
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("Modulo a recargar")
        .addChoices(
          { name: "Comandos", value: "commands" },
          { name: "Comandos Diagonales", value: "scommands" },
          { name: "Handlers", value: "handlers" },
          { name: "Eventos", value: "events" }
        )
    ),
  OWNER: true,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const args = interaction.options.get("module")?.value || "Nada";

    let opt = "Commands, Slash Commands, Events & Handlers";

    try {
      switch (args) {
        case "commands":
          {
            opt = "Commands";
            await client.loadCommands();
          }
          break;

        case "scommands":
          {
            opt = "Slash Commands";
            await client.loadSlashCommands();
          }
          break;

        case "handlers":
          {
            opt = "Handlers";
            await client.loadHandlers();
          }
          break;

        case "events":
          {
            opt = "Events";
            await client.loadEvents();
          }
          break;

        default:
          {
            await client.loadCommands();
            await client.loadSlashCommands();
            await client.loadHandlers();
            await client.loadEvents();
          }
          break;
      }

      interaction.reply({
        embeds: [
          new EmbedBuilder().addFields({
            name: `✅ ${opt} recargados`,
            value: "Okay!",
          }),
        ],
      });
    } catch (e) {
      console.log(e);
      interaction.reply(
        "❌ Ha habido un error al intentar recargar los archivos!\n*Mas detalles en la consola*"
      );
    }
  },
};
