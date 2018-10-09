const { makeExecutableSchema } = require("graphql-tools");
const { ApolloServer } = require("apollo-server-express");
const { Core } = require("@aerogear/data-sync-gql-core");
const config = require("../config").postgresConfig;

async function applyExecutionLayerForSchema(app, schemaName, options) {
    const core = new Core(config, makeExecutableSchema);
    const { schema, dataSources } = await core.buildSchema(schemaName, null, null);
    await core.connectActiveDataSources(dataSources);
    const apolloServer = new ApolloServer({
        schema
    });
    apolloServer.applyMiddleware({ app, path: options.path });
}

module.exports = applyExecutionLayerForSchema;
