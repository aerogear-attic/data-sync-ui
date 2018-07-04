import { Sequelize } from "sequelize";
import { postgresConfig as config }  from "../config";
import { error } from "../logger";
import DataSourceModel from "./dataSource";

let db = null;

// If in test mode use sqlite3 in-memory storage
if (process.env.NODE_ENV === "test") {
    db = new Sequelize('sqlite://:memory:', null, null, {
        dialect: "sqlite"
    });
} else {
    db = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: "postgres"
    });
}

const database = db;
const dataSource = DataSourceModel(database, Sequelize);

const sync = callback => {
    database.sync({ force: false })
        .then((callback))
        .catch(err => {
            error("Err in sync function", err);
        });
};

export {
    database,
    dataSource,
    sync
};
