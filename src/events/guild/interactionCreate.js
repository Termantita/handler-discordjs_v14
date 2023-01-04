const { BaseInteraction } = require("discord.js");
const Client = require("../../structures/Client");

// const { OWNER_ID } = require("../../config");

/* DESCRIPTION: Controla cada interacción que se cree, revisando si es del tipo 'isChatInputCommand()' y si viene de un guild o un canal, que también puede ser DM. 
Es lo mismo a usar un client.on('interactionCreate', () => {})*/
/**
 * @param {Client} client
 * @param {BaseInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.guild || !interaction.channel) return;

  if (interaction.isChatInputCommand()) {
    // Obtine el 'commandName' de los comandos almacenados en la Collection() slashCommands cargada antes al iniciar el bot o al recargar los archivos
    const COMMAND = client.slashCommands.get(interaction?.commandName);
    if (COMMAND) {
      if (COMMAND.OWNER) {
        // const OWNERS = process.env.OWNERS_ID.split(' ');

        if (!process.env.OWNER_ID.includes(interaction.user.id))
          return interaction.reply({
            content: `❌ **Solo los dueños de este bot pueden ejecutar este comando**\nDueño del bot: ${process.env.OWNER_ID}`,
          });
      }

      if (COMMAND.BOT_PERMISSIONS) {
        if (
          !interaction.guild.members.me.permissions.has(COMMAND.BOT_PERMISSIONS)
        )
          return interaction.reply({
            content: `❌ **Necesito los siguientes permisos para ejecutar este comando**\n${COMMAND.BOT_PERMISSIONS.map(
              (perm) => `\`${perm}\``
            ).join(" .")}`,
          });
      }

      if (COMMAND.BOT_PERMISSIONS) {
        if (!interaction.member.permissions.has(COMMAND.PERMISSIONS))
          return interaction.reply({
            content: `❌ **Necesitas los siguientes permisos para ejecutar este comando**\n${COMMAND.PERMISSIONS.map(
              (perm) => `\`${perm}\``
            ).join(" .")}`,
          });
      }

      try {
        await COMMAND.execute(client, interaction);
      } catch (err) {
        if (!interaction.isModalSubmit()) {
          await interaction.reply({
            content:
              "**Ha ocurrido un error al ejecutar el comando!**\n*Mas detalles en la consola*",
          });
        }
        console.log(err);
        return;
      }
    }
  } else if (interaction.isContextMenuCommand()) {
    const CTXCOMMAND = client.appCommands.get(interaction?.commandName.toLowerCase());
    if (!CTXCOMMAND) return;

    try {
      return CTXCOMMAND.execute(client, interaction);
    } catch (err) {
      await interaction.reply({
        content:
          "**Ha ocurrido un error al ejecutar el comando!**\n*Mas detalles en la consola*",
      });
    }
  }
  else {
    return console.log('Interaction not handled');
  }
};
