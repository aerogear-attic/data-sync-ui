const { Sequelize } = require("sequelize");
const { createDatabase, supportsiLike } = require("./database");
const DataSourceModel = require("./dataSource");
const SchemaModel = require("./schema");
const ResolverModel = require("./resolver");
const SubscriptionModel = require("./subscription");

const database = createDatabase();
const dataSource = DataSourceModel(database, Sequelize);
const schema = SchemaModel(database, Sequelize);
const resolver = ResolverModel(database, Sequelize);
const subscription = SubscriptionModel(database, Sequelize);

resolver.belongsTo(dataSource, {
    onDelete: "cascade",
    foreignKey: {
        allowNull: false
    }
});

resolver.belongsTo(schema, {
    onDelete: "cascade",
    foreignKey: {
        allowNull: false
    }
});

subscription.belongsTo(schema, {
    onDelete: "cascade",
    foreignKey: {
        allowNull: false
    }
});

dataSource.hasMany(resolver, { as: "resolvers" });
schema.hasMany(resolver, { as: "resolvers" });

/**
 * Syncs the models with the database to create all tables
 * and associations
 */
const sync = () => database.sync({ force: false });

/**
 * Drops all tables. Should only be used in combination with sync
 * to start from scratch
 */
const reset = () => database.dropAllSchemas({ logging: false });

module.exports = {
    database,
    dataSource,
    sync,
    reset,
    schema,
    resolver,
    supportsiLike,
    subscription
};
