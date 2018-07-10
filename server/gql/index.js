const ExpressGraphQL = require("express-graphql");
const { info } = require("../logger");
const { graphql } = require("../config");
const { Schema, root } = require("./schema");

const GQL_PATH = "graphql";

module.exports = App => {
    App.use(`/${GQL_PATH}`, ExpressGraphQL({
        schema: Schema,
        rootValue: root,
        graphiql: graphql.debug
    }));

    info(`GraphQl server mounted at /${GQL_PATH}`);
};
