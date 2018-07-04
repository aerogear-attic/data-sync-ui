import { Sequelize } from "sequelize";
import {  postgresConfig } from "../config";

let database = null;

// If in test mode use sqlite3 in-memory storage
if (process.env.NODE_ENV === "test") {
    database = new Sequelize('sqlite://:memory:', null, null, {
        dialect: "sqlite"
    });
} else {
    database = new Sequelize(postgresConfig.database, postgresConfig.username, postgresConfig.password, {
        host: postgresConfig.host,
        dialect: "postgres"
    });
}

const dataSource = require("./dataSource")(database, Sequelize);

const sync = callback => {
    database.sync({ force: false })
        .then((callback))
        .catch(err => {
            console.log("Err in sync function", err);
        });
};

export {
    database,
    dataSource,
    sync
};
