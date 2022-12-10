const { Client } = require("discord.js");

module.exports = (client = Client) => {
  if (client?.application?.commands) {
    client.application.commands.set(client.slashArray);
    console.log(`(/) ${client.slashCommands.size} Published Commands`.green);
  }

  setTimeout(() => [
  console.log(`Logged in as ${client.user.tag}`.green)]
  , 700);
  // console.log(`Logged in as ${client.user.tag}`.green);
};
