const { createLogger, format, transports } = require("winston");
const { logging } = require("./config");

const logger = createLogger({
    level: logging.level,
    format: format.simple(),
    transports: [new transports.Console()]
});

const { info, warn, error, debug } = logger;

module.exports = {
    info,
    warn,
    error,
    debug
};
