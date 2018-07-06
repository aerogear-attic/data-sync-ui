import { buildSchema } from "graphql";
import { info } from "../logger";
import { dataSource } from "../models";

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory,
        Postgres
    },
    type Query {
        dataSources: [DataSource],
        getOneDataSource(id: Int!): DataSource
    },
    type Mutation {
        createDataSource(name: String!, type: DataSourceType!,  config: String!): DataSource
        deleteDataSource(id: Int!): DataSource
        updateDataSource(id: Int!, name: String!, type: DataSourceType!,  config: String!): DataSource
    },  
    type DataSource {
        id: Int!       
        name: String!
        type: DataSourceType! 
        config: String!
    }
`);

const listDataSources = () => {
    info("listDataSources request");
    return dataSource.findAll();
};

const getOneDataSource = ({ id }) => {
    info("getOneDataSource request");
    return dataSource.findById(id);
};

const deleteDataSource = ({ id }) => {
    info("deleteDataSource request");
    dataSource.findById(id)
        .then(foundDataSource => {
            if (!foundDataSource) {
                return;
            }
            return foundDataSource.destroy({ force: true });
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

const createDataSource = ({ name, type, config }) => {
    info("createDataSource request");
    return dataSource.create({
        name,
        type,
        config
    });
};

const root = {
    dataSources: listDataSources,
    createDataSource,
    getOneDataSource,
    deleteDataSource,
    updateDataSource
};

export { Schema, root };
