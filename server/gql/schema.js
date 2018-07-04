import { buildSchema } from "graphql";
import { info } from "../logger";
import { dataSource } from "../models";

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory
    },
    type Query {
        dataSources: [DataSource]
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

const root = { dataSources: listDataSources };

export { Schema, root };
