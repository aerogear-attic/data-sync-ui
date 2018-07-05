import { Sequelize } from "sequelize";
import { createDatabase } from "./database";
import DataSourceModel from "./dataSource";

const database = createDatabase();
const dataSource = DataSourceModel(database, Sequelize);

const sync = () => database.sync({ force: false });

export {
    database,
    dataSource,
    sync
};
