

const Sequelize = require("sequelize");
const config = require("../config").postgresConfig;

const database = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "postgres"
});

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
