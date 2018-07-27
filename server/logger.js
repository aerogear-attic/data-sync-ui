const log = require("pino")();
const expressPino = require("express-pino-logger")({ logger: log });

module.exports = {
    log,
    expressPino
};
