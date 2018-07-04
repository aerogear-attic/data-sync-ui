"use strict";

let Sequelize = require('sequelize')
    , config = require('../config').postgresConfig;

const database = new Sequelize(config.database, config.username, config.password, {
    'host': config.host,
    'dialect': 'postgres'
});

let dataSource = require('./dataSource')(database, Sequelize);

const sync =  (callback) => {
    database.sync({force: false})
        .then( (callback))
        .catch( (err) => {
            console.log("Err in sync function", err);
        })
};

module.exports = {
    database,
    dataSource,
    sync
};