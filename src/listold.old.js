const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const User = require("../../models/user");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription(
    "Lista los registros guardados en la base de datos"
  ),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const getRegisters = async (from = 0) => {
      const [total, registers] = await Promise.all([
        User.countDocuments(),
        User.find().skip(Number(from)).limit(Number(15)),
      ]);
      return { total, registers };
    };

    let index = 0;
    const { total, registers } = await getRegisters(index * 15);
    const lastTotal = total;

    const embed = new EmbedBuilder()
      .setTitle(`Mostrando ${15 * index} de ${total}`)
      .setColor("#FF0000");

    registers.forEach((reg) =>
      embed.addFields({ name: `${reg.username} - *${reg.id}*`, value: reg.msg })
    );

    let prevPage = new ButtonBuilder()
      .setEmoji("◀")
      .setCustomId("prevPage")
      .setStyle(ButtonStyle.Primary);
    let nextPage = new ButtonBuilder()
      .setEmoji("▶")
      .setCustomId("nextPage")
      .setStyle(ButtonStyle.Primary);
    let home = new ButtonBuilder()
      .setEmoji("🏠")
      .setCustomId("home")
      .setStyle(ButtonStyle.Danger);

    if (index === 0) prevPage.setDisabled(true);
    let rowButtons = new ActionRowBuilder().addComponents(
      prevPage,
      home,
      nextPage
    );
    await interaction.reply({ embeds: [embed], components: [rowButtons] });

    client.on("interactionCreate", async (iBtn) => {
      if (!iBtn.isButton()) return;

      if (iBtn.customId === "prevPage") {
        // if (index * 15 > total) {
        //   index = 0;
        // }

        --index;
        const { total, registers } = await getRegisters(15 * index);

        if (index <= 0) {
          prevPage.setDisabled(true);
        }

        const embed = new EmbedBuilder().setTitle(
          `Mostrando ${15 * index} de ${total}`
        );

        registers.forEach((reg) => {
          embed.addFields({
            name: `${reg.username} - *${reg.id}*`,
            value: reg.msg,
          });
        });

        iBtn.update({
          embeds: [embed],
        });
      } else if (iBtn.customId === "nextPage") {
        let prevPage = new ButtonBuilder()
          .setEmoji("◀")
          .setCustomId("prevPage")
          .setStyle(ButtonStyle.Primary);
        let nextPage = new ButtonBuilder()
          .setEmoji("▶")
          .setCustomId("nextPage")
          .setStyle(ButtonStyle.Primary);

        prevPage.setDisabled(false);

        if (index < lastTotal - 1) ++index;
        const { total, registers } = await getRegisters(15 * index);
        if (index * 15 === total)
          if (index * 15 >= total) nextPage.setDisabled(true);

        const embed = new EmbedBuilder().setTitle(
          `Mostrando ${15 * index} de ${total}`
        );

        registers.forEach((reg) =>
          embed.addFields({
            name: `${reg.username} - *${reg.id}*`,
            value: reg.msg,
          })
        );

        rowButtons = new ActionRowBuilder().addComponents(
          prevPage,
          home,
          nextPage
        );

        iBtn.update({
          embeds: [embed],
          components: [rowButtons],
        });
      } else if (iBtn.customId === "home") {
        iBtn.update("Hola!");
        index = 0;
      }
    });

    // console.log(registers);
  },
};
