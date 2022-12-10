module.exports = {
  DESCRIPTION: "Te permite ver el ping del bot",
  async execute(client, message, args, prefix) {
    return message.reply(`${client.ws.ping}ms`);
  },
};
