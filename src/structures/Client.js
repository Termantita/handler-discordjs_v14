const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");
const BotUtils = require("./Utils");

const token = process.env.TOKEN || "MTA1MDY2OTMzNzY1ODI2OTc2Nw.GWvVyu.zvlHKJ10ZgibIZfCp5slFxgh54t6faEhh6bd_Q";
const clientId = process.env.CLIENT_ID;
const prefix = process.env.PREFIX || "m!";
const status = process.env.STATUS || "Decoren Abendregen";
const statusType = process.env.STATUS_TYPE;
const color = process.env.COLOR;
const ownerId = process.env.OWNER_ID;

module.exports = class extends Client {
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildEmojisAndStickers,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
      ],

      allowsMention: {
        parse: ["roles", "users"],
        repliedUser: false,
      },

      presence: {
        activities: [
          {
            name: status,
            type: ActivityType[statusType],
          },
        ],
        status: PresenceUpdateStatus.Online,
      },
    }
  ) {
    super({ ...options });

    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.slashArray = [];

    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    await this.loadHandlers();
    await this.loadEvents();
    await this.loadCommands();
    await this.loadSlashCommands();
    this.login(token);
  }

  async loadCommands() {
    console.log(`(${prefix}) Loading Commands...`.yellow);
    this.commands.clear();

    const FILES_PATH = await this.utils.loadFiles("/src/commands");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const COMMAND = require(filePath);
          const COMMAND_NAME = filePath
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          COMMAND.NAME = COMMAND_NAME;

          if (COMMAND_NAME) this.commands.set(COMMAND_NAME, COMMAND);
        } catch (err) {
          console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
          console.log(err);
        }
      });
    }

    console.log(`(${prefix}) ${this.commands.size} Loaded Commands`.green);
  }

  async loadSlashCommands() {
    console.log(`(/) Loading Commands...`.yellow);
    await this.commands.clear();
    this.slashArray = [];

    const FILES_PATH = await this.utils.loadFiles("/src/slashCommands");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const COMMAND = require(filePath);
          const COMMAND_NAME = filePath
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          COMMAND.CMD.name = COMMAND_NAME;

          if (COMMAND_NAME) this.slashCommands.set(COMMAND_NAME, COMMAND);

          this.slashArray.push(COMMAND.CMD.toJSON());
        } catch (err) {
          console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
          console.log(err);
        }
      });
    }

    console.log(`(/) ${this.slashCommands.size} Loaded Commands`.green);

    if (this?.application?.commands) {
      this.application.commands.set(this.slashArray);
      console.log(`(/) ${this.slashCommands.size} Published Commands`.green);
    }
  }

  async loadHandlers() {
    console.log(`(-) Loading Handlers...`.yellow);
    await this.commands.clear();

    const FILES_PATH = await this.utils.loadFiles("/src/handlers");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          require(filePath)(this);
        } catch (err) {
          console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
        }
      });
    }

    console.log(`(-) ${FILES_PATH.length} Loaded Handlers`.green);
  }

  async loadEvents() {
    console.log(`(+) Loading Events...`.yellow);
    await this.commands.clear();

    const FILES_PATH = await this.utils.loadFiles("/src/events");
    this.removeAllListeners();

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const EVENT = require(filePath).bind();
          const EVENT_NAME = filePath
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          this.on(EVENT_NAME, EVENT.bind(null, this));
        } catch (err) {
          console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
          console.log(err);
        }
      });
    }

    console.log(`(+) ${FILES_PATH.length} Loaded Events`.green);
  }
};
