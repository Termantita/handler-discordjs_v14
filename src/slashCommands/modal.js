const {
  CommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,

  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const Client = require("../structures/Client");

const User = require("../models/user");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Test de modal/formulario"),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const modal = new ModalBuilder()
      .setTitle("Test de modal / formulario")
      .setCustomId("modal");

    const textInputP = new TextInputBuilder()
      .setCustomId("pInput")
      .setLabel("Input text - paragraph")
      .setStyle(TextInputStyle.Paragraph);

    const textInputS = new TextInputBuilder()
      .setCustomId("sInput")
      .setLabel("Input text - short")
      .setStyle(TextInputStyle.Short);
    const textInputS2 = new TextInputBuilder()
      .setCustomId("sInput2")
      .setLabel("Input text - short 2")
      .setStyle(TextInputStyle.Short);

    const componentsRows = [
      new ActionRowBuilder().addComponents(textInputP),
      new ActionRowBuilder().addComponents(textInputS),
      new ActionRowBuilder().addComponents(textInputS2),
    ];

    modal.addComponents(...componentsRows);

    await interaction.showModal(modal)

    const submitted = await interaction
      .awaitModalSubmit({
        time: 15000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch(console.warn);

    if (submitted) {
      let fieldsStr;
      console.log(submitted.fields.fields);
      
      submitted.fields.fields.each(field => fieldsStr += field.value.concat(', '));
      // const textFields = Object.keys(submitted.fields).map(key => submitted.fields.getTextInputValue(submitted.fields[key].customId))
      return await submitted.reply(
        `Esto he recibido del modal / form: ${fieldsStr}`
      );

      // return await submitted.reply('Hola!');
    }
  },

  //   /**
  //    * @param {Client} client
  //    * @param {CommandInteraction} interaction
  //    */
  //   async modalSubmit(client, interaction) {
  //     let fieldsStr;
  //     const fields = interaction.fields.fields;

  //     fields.each(field => fieldsStr += field.value.concat(', '));

  //     return await interaction.channel.send(`Esto he recibido del modal / form: ${fieldsStr}`);
  //   },
};
