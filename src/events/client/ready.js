const Client = require("../../structures/Client");


/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
  if (client?.application?.commands) {
    client.application.commands.set(client.slashctxArray);
    console.log(`(/) ${client.slashCommands.size} Published Commands`.green);
    console.log(`(ctx) ${client.appCommands.size} Published Commands`.green);
  }

  setTimeout(() => [console.clear(),
  console.log(`Logged in as ${client.user.tag}`.green)]
  , 1600);
  // setTimeout(() => console.log(`Logged in as ${client.user.tag}`.green)
  //   , 1000);
};
