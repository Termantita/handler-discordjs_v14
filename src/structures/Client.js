const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
  Colors,
} = require("discord.js");

const BotUtils = require("./Utils");

// const config = require("../config");
const { connectDB } = require("../db/config");

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const status = process.env.STATUS;
const statusType = process.env.STATUS_TYPE;
const color = Colors.Red;

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
    this.color = color;
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.appCommands = new Collection();
    this.modalsSubmit = new Collection();

    this.slashArray = [];
    this.ctxArray = [];
    this.slashctxArray = [];

    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    await this.loadHandlers();
    await this.loadEvents();
    await this.loadCommands();
    // await this.loadSlashCommands();
    // await this.loadAppCommands();
    await this.loadSlashAppCommands();

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

  async loadSlashAppCommands() {
    const loadSlashCommands = async () => {
      console.log(`(/) Loading Commands...`.yellow);
      this.slashCommands.clear();
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
  
      // if (this?.application?.commands) {
      //   this.application.commands.set(this.slashArray);
      //   console.log(`(/) ${this.slashCommands.size} Published Commands`.green);
      // }
    }
    const loadAppCommands = async () => {
      console.log(`(ctx) Loading Commands...`.yellow);
      this.appCommands.clear();
      this.ctxArray = [];
  
      const FILES_PATH = await this.utils.loadFiles("/src/appCommands");
  
      if (FILES_PATH.length) {
        FILES_PATH.forEach((filePath) => {
          try {
            const APPCOMMAND = require(filePath);
            const APPCOMMAND_NAME = filePath
              .split("\\")
              .pop()
              .split("/")
              .pop()
              .split(".")[0];
            APPCOMMAND.CMD.name =
              APPCOMMAND_NAME.charAt(0).toUpperCase() + APPCOMMAND_NAME.slice(1);
  
            if (APPCOMMAND_NAME) this.appCommands.set(APPCOMMAND_NAME, APPCOMMAND);
  
            this.ctxArray.push(APPCOMMAND.CMD.toJSON());
          } catch (err) {
            console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
            console.log(err);
          }
        });
      }
  
      console.log(`(ctx) ${this.appCommands.size} Loaded Commands`.green);
  
      // if (this?.application?.commands) {
      //   this.application.commands.set(this.slashctxArray);
      //   console.log(`(ctx) ${this.appCommands.size} Published Commands`.green);
      // }
    }

    await loadSlashCommands();
    await loadAppCommands();
    this.slashctxArray = [].concat(this.slashArray, this.ctxArray);
    if (this?.application?.commands) {
      this.application.commands.set(this.slashctxArray);
      console.log(`(/) ${this.slashCommands.size} Published Commands`.green);
      console.log(`(ctx) ${this.appCommands.size} Published Commands`.green);
    }
  }



  async loadHandlers() {
    console.log(`(-) Loading Handlers...`.yellow);

    const FILES_PATH = await this.utils.loadFiles("/src/handlers");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          require(filePath)(this);
        } catch (err) {
          console.log(`THERE WAS AN ERROR LOADING THE FILE ${filePath}`.bgRed);
          return console.log(err);
        }
      });
    }

    console.log(`(-) ${FILES_PATH.length} Loaded Handlers\n`.green);
  }

  async loadEvents() {
    console.log(`(+) Loading Events...`.yellow);

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
