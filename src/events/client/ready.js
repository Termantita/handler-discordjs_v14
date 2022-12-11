const { Client } = require("discord.js");

module.exports = (client = Client) => {
  if (client?.application?.commands) {
    client.application.commands.set(client.slashArray);
    console.log(`(/) ${client.slashCommands.size} Published Commands`.green);
  }

  setTimeout(() => [console.clear(),
  console.log(`Logged in as ${client.user.tag}`.green)]
  , 1600);
  // setTimeout(() => console.log(`Logged in as ${client.user.tag}`.green)
  //   , 1000);
};
