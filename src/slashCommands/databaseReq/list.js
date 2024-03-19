const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");

const {
  CommandInteraction,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const Client = require("../../structures/Client");

const Message = require("../../models/message");

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
    const messageFilter = interaction.options.get("filter")?.value || "";
    const getMessages = async (from = 0, limit = 15) => {
      if (!client.restInstance.isLogged) {
        let query;
        if (messageFilter)
          query = Message.find({ id: messageFilter })
            .skip(Number(from))
            .limit(Number(limit));
        else query = Message.find().skip(Number(from)).limit(Number(limit));

        const [total, messages] = await Promise.all([
          Message.countDocuments(),
          query,
        ]);
        return { total, messages };
      } else {
        const { total, messages } = await client.restInstance.getMessages(from, limit, messageFilter);
        return { total, messages }
      }
    };

    const { total, messages } = await getMessages(0);

    if (total === 0 && messages.length === 0) {
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

      messages.forEach((reg) =>
        embed.addFields({
          name: `${reg.username} - *${reg.id}*`,
          value: reg.messsage,
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

    messages.forEach((reg) =>
      embed.addFields({
        name: `${reg.username} - *${reg.id}*`,
        value: reg.message,
      })
    );

    let prevPage = new ButtonBuilder()
      .setEmoji({ name: "◀" })
      .setCustomId("prevPage")
      .setStyle(ButtonStyle.Primary);
    let nextPage = new ButtonBuilder()
      .setEmoji({ name: "▶" })
      .setCustomId("nextPage")
      .setStyle(ButtonStyle.Primary);
    let home = new ButtonBuilder()
      .setEmoji({ name: "🏠" })
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
      filter: (u) => u.user.id === interaction.user.id,
      time: 10000,
    });

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
      } else nextPage.setDisabled(false);

      const embed = new EmbedBuilder()
        .setTitle(
          // `Mostrando ${(index * 15 === 1 || 15) + restRegisters} de ${lastTotal}. ${index} de ${totalPages}`
          `Registros: ${lastTotal}. Pagina ${index} de ${totalPages}`
        )
        .setColor(client.color);

      const { messages } = await getMessages(15 * index);

      messages.forEach((reg) =>
        embed.addFields({
          name: `${reg.username} - *${reg.id}*`,
          value: reg.message,
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
      interaction.deleteReply();
      index = 0;
    });
    return;
  },
};
