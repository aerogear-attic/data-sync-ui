const log = require("pino")();
const expressPino = require("express-pino-logger")({ level: "silent", logger: log });

module.exports = {
    log,
    expressPino
};
