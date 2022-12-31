const { EmbedBuilder } = require("@discordjs/builders");
const { Message } = require("discord.js");
const Client = require("../../structures/Client");

module.exports = {
  DESCRIPTION:
    "Te permite recargar individualmente o totalmente sus funcionalidades",
  OWNER: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String} String
   * @param {String} prefix
   * **/
  async execute(client, message, args, prefix) {
    let opt = "Comandos, Comandos diagonales, Comandos de aplicación, Handlers y eventos";

    try {
      switch (args) {
        case "commands":
          {
            opt = "Commandos";
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
