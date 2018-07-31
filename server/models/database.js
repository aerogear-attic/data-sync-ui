const { Sequelize } = require("sequelize");
const { postgresConfig } = require("../config");
const { log } = require("../logger");

exports.supportsiLike = () => process.env.NODE_ENV !== "test";

exports.createDatabase = () => {
    if (process.env.NODE_ENV === "test") {
        return new Sequelize("sqlite://:memory:", null, null, { dialect: "sqlite", logging: false });
    }

    return new Sequelize(postgresConfig.database, postgresConfig.username,
        postgresConfig.password, {
            host: postgresConfig.host,
            dialect: "postgres",
            logging: postgresConfig.logSql ? log.debug : false
        });
};
