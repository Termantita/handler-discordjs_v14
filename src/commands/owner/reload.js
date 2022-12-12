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
    console.log(args);
    let opt = "Commands, Slash Commands, Events & Handlers";

    try {
      switch (args[0]?.toLowerCase()) {
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

      message.reply({
        embeds: [
          new EmbedBuilder().addFields({
            name: `✅ ${opt} recargados`,
            value: "Okay!",
          }),
        ],
      });
    } catch (e) {
      console.log(e);
      message.reply(
        "❌ Ha habido un error al intentar recargar los archivos!\n*Mas detalles en la consola*"
      );
    }
  },
};
