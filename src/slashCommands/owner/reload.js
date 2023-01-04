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
          // { name: "Comandos Diagonales", value: "slashCommands" },
          // { name: "Comandos de Aplicación", value: "appCommands" },
          { name: "Comandos diagonales y de Aplicación", value: "slashappCommands" },
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

    let opt = "Comandos, Comandos diagonales, Comandos de aplicación, Handlers y eventos";

    try {
      switch (args) {
        case "commands":
          {
            opt = "Comandos";
            await client.loadCommands();
          }
          break;

        // case "slashCommands":
        //   {
        //     opt = "Comandos diagonales";
        //     await client.loadSlashCommands();
        //   }
        //   break;
        // case "appCommands":
        //   {
        //     opt = "Comandos de aplicación";
        //     await client.loadAppCommands();
        //   }
        //   break;
        case "slashappCommands":
          {
            opt = "Comandos diagonales y de aplicación";
            await client.loadSlashAppCommands();
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
            opt = "Eventos";
            await client.loadEvents();
          }
          break;

        default:
          {
            await client.loadCommands();
            // await client.loadSlashCommands();
            // await client.loadAppCommands();
            await client.loadSlashAppCommands();
            await client.loadHandlers();
            await client.loadEvents();
          }
          break;
      }

      return await interaction.reply({
        embeds: [
          new EmbedBuilder().addFields({
            name: `✅ ${opt} recargados`,
            value: "Okay!",
          }),
        ],
      });
    } catch (e) {
      console.log(e);
      return await interaction.reply(
        "❌ Ha habido un error al intentar recargar los archivos!\n*Mas detalles en la consola*"
      );
    }
  },
};
