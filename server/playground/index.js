const { makeExecutableSchema } = require("graphql-tools");
const { ApolloServer } = require("apollo-server-express");
const { Core } = require("@aerogear/data-sync-gql-core");
const config = require("../config").postgresConfig;

async function applyExecutableMiddleware(app) {
    const core = new Core(config, makeExecutableSchema);
    const { schema, dataSources } = await core.buildSchema("default", null, null);
    await core.connectActiveDataSources(dataSources);
    const apolloServer = new ApolloServer({
        schema
    });
    apolloServer.applyMiddleware({ app, path: "/graphqldata" });
}

module.exports = applyExecutableMiddleware;
