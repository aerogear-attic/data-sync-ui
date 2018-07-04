import { Sequelize } from "sequelize";
import { postgresConfig as config } from "../config";

export function createDatabase() {
    if (process.env.NODE_ENV === "test") {
        return new Sequelize("sqlite://:memory:", null, null, { dialect: "sqlite" });
    }
    return new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: "postgres"
    });
}
