import { buildSchema } from "graphql";
import { info } from "../../ui/utils/logger";

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
    }
`);

function listDataSources() {
    info("listDataSources request");

    return [{
        id: 1,
        name: "best source eva",
        type: "InMemory"
    }, {
        id: 2,
        name: "another source",
        type: "InMemory"
    }];
};

const root = {
    dataSources: listDataSources
};

export { Schema, root };
