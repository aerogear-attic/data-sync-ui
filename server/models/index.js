const { Sequelize } = require("sequelize");
const { createDatabase } = require("./database");
const DataSourceModel = require("./dataSource");
const SchemaModel = require("./schema");

const database = createDatabase();
const dataSource = DataSourceModel(database, Sequelize);
const schema = SchemaModel(database, Sequelize);

const sync = () => database.sync({ force: false });

module.exports = {
    database,
    dataSource,
    sync,
    schema
};
