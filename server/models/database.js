const { Sequelize } = require("sequelize");
const { postgresConfig } = require("../config");
const { log } = require("../logger");

exports.supportsiLike = function () {
    return process.env.NODE_ENV !== "test";
};

exports.createDatabase = function () {
    if (process.env.NODE_ENV === "test") {
        return new Sequelize("sqlite://:memory:", null, null, { dialect: "sqlite" });
    }

    return new Sequelize(postgresConfig.database, postgresConfig.username,
        postgresConfig.password, {
            host: postgresConfig.host,
            dialect: "postgres",
            logging: postgresConfig.logSql ? log.debug : false
        });
};
