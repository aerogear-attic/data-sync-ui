import { Sequelize } from "sequelize";
import { error } from "../logger";
import { createDatabase } from "./database";
import DataSourceModel from "./dataSource";

const database = createDatabase();
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
