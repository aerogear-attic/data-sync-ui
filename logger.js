"use strict";

const { createLogger, format, transports } = require("winston")
    , { logging } = require("./config");

const logger  = createLogger({
    level: logging.level,
    format: format["simple"](),
    transports: [
        new transports.Console()
    ]
});

// Export a function that will log info by default
module.exports = function () {
    logger.info.apply(null, Array.prototype.slice.call(arguments));
};

// Export the other log level functions
module.exports.info = logger.info;
module.exports.warn = logger.warn;
module.exports.error = logger.error;
module.exports.debug = logger.debug;
