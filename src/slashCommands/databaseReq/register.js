const { SlashCommandBuilder } = require('@discordjs/builders')

const { CommandInteraction } = require("discord.js");
const Client = require('../../structures/Client');

const Message = require('../../models/message');

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
    const username = target.tag;
    const id = target.id;
    const message = interaction.options.get('message').value;
    // const msg = interaction.options.data[0]['value'];
    if (!client.restInstance.isLogged) {

      const cursor = new Message({username, id, message});

      try {
        await cursor.save();
      } catch (err) {
        console.log(err);
        return await interaction.reply('❌ Ha habido un error al intentar guardar el registro en la DB\n*Mas detalles en la consola*');
      };
    } else {
      client.restInstance.postMessage(username, id, message);
    }
    return await interaction.reply(`✅ Registro guardado en la base de datos.`);
  },
};
