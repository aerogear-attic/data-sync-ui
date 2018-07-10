const { buildSchema } = require("graphql");
const { info } = require("../logger");
const { dataSource, database } = require("../models");

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory,
        Postgres
    },
    type Query {
        dataSources(name: String): [DataSource],
        getOneDataSource(id: Int!): DataSource
    },
    type Mutation {
        createDataSource(name: String!, type: DataSourceType!, config: String!): DataSource
        deleteDataSource(id: Int!): DataSource
        updateDataSource(id: Int!, name: String!, type: DataSourceType!, config: String!): DataSource
    },  
    type DataSource {
        id: Int!
        name: String!
        type: DataSourceType! 
        config: String!
    }
`);

const createDataSource = ({ name, type, config }) => {
    info("createDataSource request");
    return dataSource.create({
        name,
        type,
        config
    });
};

const listDataSources = ({ name }) => {
    info("listDataSources request");
    if (name) {
        return dataSource.findAll({ where: { name: { [database.Op.iLike]: `%${name}%` } } });
    }
    return dataSource.findAll();
};

const getOneDataSource = ({ id }) => {
    info("getOneDataSource request");
    return dataSource.findById(id);
};

const deleteDataSource = ({ id }) => {
    info(`deleteDataSource request for id ${id}`);
    return dataSource.findById(id)
        .then(foundDataSource => {
            if (!foundDataSource) {
                return null;
            }
            return foundDataSource.destroy({ force: true }); // eslint-disable-line
        });
};

const updateDataSource = ({ id, name, type, config }) => {
    info("updateDataSource request");
    return dataSource.findById(id).then(foundDataSource => foundDataSource.update({
        name,
        type,
        config
    }));
};

const root = {
    dataSources: listDataSources,
    createDataSource,
    getOneDataSource,
    deleteDataSource,
    updateDataSource
};

module.exports = { Schema, root };
