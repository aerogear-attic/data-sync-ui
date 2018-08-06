const log = require("pino")();
const expressPino = require("express-pino-logger")({ level: "silent", logger: log });

const auditLogger = log.child({ tag: "AUDIT" });

const auditLogEnabled = process.env.AUDIT_LOGGING !== "false" && process.env.AUDIT_LOGGING !== false;

function auditLog(obj) {
    if (auditLogEnabled) {
        auditLogger.info(obj);
    }
}

module.exports = {
    log,
    expressPino,
    auditLog
};
