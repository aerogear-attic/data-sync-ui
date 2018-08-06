const { auditLogConfig } = require("./config");

const log = require("pino")();
const expressPino = require("express-pino-logger")({ level: "silent", logger: log });

const auditLogger = log.child({ tag: auditLogConfig.tag });

function auditLog(obj) {
    if (auditLogConfig.enabled) {
        auditLogger.info(obj);
    }
}

module.exports = {
    log,
    expressPino,
    auditLog
};
