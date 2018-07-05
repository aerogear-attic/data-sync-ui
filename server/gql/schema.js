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
    },  
    input DataSourceInput {
         id: Int!
         name: String
         type: DataSourceType
         config: String!
    },  
    type DataSource {
        id: Int!       
        name: String!
        type: DataSourceType! 
        config: String!
    }
`);

function listDataSources() {
    info("listDataSources request");
    return dataSource.findAll();
}

function getOneDataSource({id}) {
    info("getOneDataSource request");
    return dataSource.findById(id);
}

function createDataSource({name, type, config}) {
    info("createDataSource request");
    return dataSource.create({
        name: name,
        type: type,
        config: config
    });
}

const root = {
    dataSources: listDataSources,
    createDataSource: createDataSource,
    getOneDataSource: getOneDataSource
};

export { Schema, root };
