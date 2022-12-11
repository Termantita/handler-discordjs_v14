const { Message, Client } = require("discord.js");
const { PREFIX } = require("../../config");

const prefix = PREFIX;

/**
* @param {Client} client
* @param {Message} message
**/
module.exports = async (client, message) => {
  if (!message.guild || !message.channel || message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;
  
  const ARGS = message.content
    .slice(prefix.length)
    .trim()
    .split("/ +/");
  const CMD = ARGS.shift()?.toLowerCase();

  const COMMAND =
    client.commands.get(CMD) ||
    client.commands.find((c) => c.ALIASES && c.ALIASES.includes(CMD));

  if (COMMAND) {
    if (COMMAND.OWNER) {
      // const OWNERS = process.env.OWNERS_ID.split(' ');
      const OWNER = process.env.OWNER_ID;
      
      if (!OWNER.includes(message.author.id))
      return message.reply({
        content: `❌ **Solo los dueños de este bot pueden ejecutar este comando**\nDueño del bot: ${process.env.OWNER}`,
      });
    }

      if (COMMAND.BOT_PERMISSIONS) {
        if (!message.guild.members.me.permissions.has(COMMAND.BOT_PERMISSIONS))
          return message.reply({
            content: `❌ **Necesito los siguientes permisos para ejecutar este comando**\n${COMMAND.BOT_PERMISSIONS.map(
              (perm) => `\`${perm}\``
            ).join(" .")}`,
          });
      }

      if (COMMAND.BOT_PERMISSIONS) {
        if (!message.member.permissions.has(COMMAND.PERMISSIONS))
          return message.reply({
            content: `❌ **Necesitas los siguientes permisos para ejecutar este comando**\n${COMMAND.PERMISSIONS.map(
              (perm) => `\`${perm}\``
            ).join(" .")}`,
          });
      }

      try {
        COMMAND.execute(client, message, ARGS, prefix);
      } catch (err) {
        message.reply({
          content:
            "**Ha ocurrido un error al ejecutar el comando!**\n*Mas detalles en la consola*",
        });
        console.log(err);
        return;
      }
  }
};
