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
    type Mutation {
            createDataSource(id: Int!, name: String!, config: String!): DataSource
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

function createDataSource(name, type, config) {
    info("createDataSource request");
    return dataSource.create({
        name: name,
        type: type,
        config: JSON.stringify({config})
    }).then((dataSource) => {
          return info("Data Source created: ", dataSource.name);
    }).catch((err) => {
        return info("error creating data source: ", err);
    });
}

const root = {
    dataSources: listDataSources,
    createDataSource: createDataSource('Test Data Source', 'Postgres', '{test : test}' )
};

export { Schema, root };
