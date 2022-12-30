const {
  SlashCommandBuilder,

  CommandInteraction,

  EmbedBuilder,

  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,

  ComponentType,
  BaseInteraction,
} = require("discord.js");
const Client = require("../../structures/Client");

const User = require("../../models/user");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Lista los registros guardados en la base de datos")
    .addUserOption((option) =>
      option
        .setName("filter")
        .setDescription("Permite filtrar los registros de un usuario")
    ),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction) {
    userFilter = interaction.options.get("filter")?.value || undefined;

    const getRegisters = async (from = 0, limit = 15) => {
      let query;
      if (userFilter != undefined)
        query = User.find({ id: userFilter })
          .skip(Number(from))
          .limit(Number(limit));
      else query = User.find().skip(Number(from)).limit(Number(limit));

      const [total, registers] = await Promise.all([
        User.countDocuments(),
        query,
      ]);
      return { total, registers };
    };

    const { total, registers } = await getRegisters(0);

    if (total === 0 && registers.length === 0) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .addFields({
              name: "❌ Error",
              value: "No se encontraron registros",
            })
            .setColor(client.color),
        ],
      });
    } else if (total <= 15) {
      const embed = new EmbedBuilder()
        .setTitle(`Mostrando ${total} registros`)
        .setColor(client.color);

      registers.forEach((reg) =>
        embed.addFields({
          name: `${reg.username} - *${reg.id}*`,
          value: reg.msg,
        })
      );

      return await interaction.reply({ embeds: [embed] });
    }

    const totalPages = Math.round(total / 15);
    let index = 0;
    const lastTotal = total;

    if (Number(total) === 0)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`❌ Error`)
            .addFields({
              name: "Error",
              value: "No se han encontrado registros en la base de datos",
            })
            .setColor(client.color),
        ],
      });

    const embed = new EmbedBuilder()
      .setTitle(`Registros: ${lastTotal}. ${index} de ${totalPages}`)
      .setColor(client.color);

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

    prevPage.setDisabled(true);
    home.setDisabled(true);

    let rowButtons = new ActionRowBuilder().addComponents(
      prevPage,
      home,
      nextPage
    );
    const currentPage = await interaction.reply({
      embeds: [embed],
      components: [rowButtons],
    });

    interaction.deferReply();

    const collector = currentPage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10000,
    });
    /**
     * @param {BaseInteraction} iBtn
     **/
    collector.on("collect", async (iBtn) => {
      if (iBtn.user.id !== interaction.user.id)
        return iBtn.reply({
          content: "No puedes usar estos botones",
          ephemeral: true,
        });

      if (iBtn.customId === "prevPage") {
        if (index > 0) index--;
      } else if (iBtn.customId === "nextPage") {
        if (index < totalPages) index++;
        // index++;
      } else if (iBtn.customId === "home") {
        index = 0;
      }

      // let restRegisters = 0;

      if (index === 0) prevPage.setDisabled(true);
      else prevPage.setDisabled(false);

      if (index === 0) home.setDisabled(true);
      else home.setDisabled(false);

      if (index === totalPages) {
        nextPage.setDisabled(true);
        restRegisters = lastTotal % 15;
      } else nextPage.setDisabled(false);

      const embed = new EmbedBuilder()
        .setTitle(
          // `Mostrando ${(index * 15 === 1 || 15) + restRegisters} de ${lastTotal}. ${index} de ${totalPages}`
          `Registros: ${lastTotal}. Pagina ${index} de ${totalPages}`
        )
        .setColor(client.color);

      const { registers } = await getRegisters(15 * index);

      registers.forEach((reg) =>
        embed.addFields({
          name: `${reg.username} - *${reg.id}*`,
          value: reg.msg,
        })
      );

      await iBtn.update({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(prevPage, home, nextPage),
        ],
      });

      collector.resetTimer();
    });

    collector.on("end", async (collected) => {
      console.log(`Collected ${collected.size} items`);
      await interaction.followUp({
        content: "Se terminó el tiempo para interacturar con los botones",
        ephemeral: true,
      });
      index = 0;
    });
    return;
  },
};
