const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
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
    const [length, registers] = await Promise.all([
      User.countDocuments(),
      User.find().skip(Number(0)).limit(Number(15)),
    ]);

    const embed = new EmbedBuilder().setTitle(`Total: ${length}`).setColor('#FF0000');
    registers.forEach((reg) =>
      embed.addFields({ name: `${reg.username} - *${reg.id}*`, value: reg.msg})
    );
    return await interaction.reply({ embeds: [embed] });

    // console.log(registers);
  },
};
