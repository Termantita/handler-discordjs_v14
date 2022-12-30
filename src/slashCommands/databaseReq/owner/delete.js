const { SlashCommandBuilder } = require("@discordjs/builders");

const Client = require("../../../structures/Client");
const { CommandInteraction } = require("discord.js");

const User = require("../../../models/user");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Borra todos los registros de la base de datos")
    .addStringOption((option) =>
      option
        .setName("registers")
        .setDescription("Permite elegir que borrar de la base de datos")
        .setRequired(true)
        .addChoices({ name: "Registros", value: "deleteRegisters" })
    ),
  OWNER: true,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const option = interaction.options.get("registers").value;

    if (option === "deleteRegisters") {
      const user = await User.deleteMany();
      try {
        return await interaction.reply(
          `Se han eliminado ${user.deletedCount} registros de la base de datos`
        );
      } catch (err) {
        console.log(err);
        return await interaction.reply(
          "❌ Ha habido un error al intentar borrar los registros en la DB\n*Mas detalles en la consola*"
        );
      }
      // try {
      //   await user.save();
      // } catch (err) {
      //   console.log(err);
      //   return await interaction.reply('❌ Ha habido un error al intentar guardar el registro en la DB\n*Mas detalles en la consola*');
      // };
    }
  },
};
