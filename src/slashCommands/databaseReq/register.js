const { Client, SlashCommandBuilder, CommandInteraction } = require("discord.js");
const interactionCreate = require("../../events/guild/interactionCreate");

const User = require('../../models/user');

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Registra el mensaje que vos quieras en una base de datos")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Escribe lo que quireas para guardarlo en la DB")
        .setRequired(true)
    ),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const target = interaction.user;
    const username = target.username;
    const id = target.id;
    const msg = interaction.options.get('message').value;
    // const msg = interaction.options.data[0]['value'];
    
    const user = new User({username, id, msg})

    try {
      await user.save();
    } catch (err) {
      console.log(err);
      return await interaction.reply('❌ Ha habido un error al intentar guardar el registro en la DB\n*Mas detalles en la consola*');
    };

    return await interaction.reply(`✔ Registro guardado en la base de datos.`);
  },
};
