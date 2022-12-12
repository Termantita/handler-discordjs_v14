const { OWNER_ID } = require('../../config');

module.exports = async (client, interaction) => {
  if (!interaction.guild || !interaction.channel) return;

  if(!interaction.isChatInputCommand()) return;

  const COMMAND = client.slashCommands.get(interaction?.commandName);

  if (COMMAND) {
    if (COMMAND.OWNER) {
      // const OWNERS = process.env.OWNERS_ID.split(' ');

      if (!OWNER_ID.includes(interaction.user.id))
        return interaction.reply({
          content: `❌ **Solo los dueños de este bot pueden ejecutar este comando**\nDueño del bot: ${OWNER_ID}`,
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
      COMMAND.execute(client, interaction, "/");
    } catch (err) {
      interaction.reply({
        content:
          "**Ha ocurrido un error al ejecutar el comando!**\n*Mas detalles en la consola*",
      });
      console.log(err);
      return;
    }
  }
};
