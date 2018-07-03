import ExpressGraphQL from "express-graphql";
import { info } from "../../ui/utils/logger";
import { graphql } from "../config";
import { Schema, root } from "./schema";

const GQL_PATH = "graphql";

export default App => {
    App.use(`/${GQL_PATH}`, ExpressGraphQL({
        schema: Schema,
        rootValue: root,
        graphiql: graphql.debug
    }));

    info(`GraphQl server mounted at /${GQL_PATH}`);
};
