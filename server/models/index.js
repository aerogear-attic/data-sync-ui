import { Sequelize } from "sequelize";
import { createDatabase } from "./database";
import DataSourceModel from "./dataSource";
import SchemaModel from "./schema";

const database = createDatabase();
const dataSource = DataSourceModel(database, Sequelize);
const schema = SchemaModel(database, Sequelize);

const sync = () => database.sync({ force: false });

export {
    database,
    dataSource,
    sync,
    schema
};
