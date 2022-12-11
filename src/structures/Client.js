const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");

const { connectDB } = require('../db/config');
const BotUtils = require("./Utils");
const config = require('../config');

const token = config.TOKEN
const prefix = config.PREFIX
const status = config.STATUS;
const statusType = config.STATUS_TYPE;
const color = config.COLOR;
const ownerId = config.OWNER_ID;

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
    super({...options});

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
    await connectDB();
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

    console.log(`(${prefix}) ${this.commands.size} Loaded Commands\n`.green);
  }

  async loadSlashCommands() {
    console.log(`(/) Loading Commands...`.yellow);
    await this.slashCommands.clear();
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

    console.log(`(-) ${FILES_PATH.length} Loaded Handlers\n`.green);
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

    console.log(`(+) ${FILES_PATH.length} Loaded Events\n`.green);
  }
};
