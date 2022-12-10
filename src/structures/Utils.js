const { glob } = require("glob");
const { promisify } = require("util");
const proGlob = promisify(glob);

class BotUtils {
  constructor(client) {
    this.client = client;
  }

  async loadFiles(dirName) {
    const FILES = await proGlob(
      `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
    );
    FILES.forEach((FILE) => delete require.cache[require.resolve(FILE)]);
    return FILES;
  }
}

module.exports = BotUtils;
