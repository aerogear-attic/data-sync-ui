const { buildSchema } = require("graphql");
const { info, warn, error } = require("../logger");
const { dataSource, database, supportsiLike, schema, resolver } = require("../models");
const { compileSchemaString, formatGraphqlErrors } = require("./helper");
const { publish, DEFAULT_CHANNEL } = require("../configNotifiers/configNotifierCreator");

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory,
        Postgres
    },
    type Query {
        dataSources(name: String): [DataSource]
        getOneDataSource(id: Int!): DataSource
        getSchema(name: String!): Schema
    },
    type Mutation {
        createDataSource(name: String!, type: DataSourceType!, config: String!): DataSource
        deleteDataSource(id: Int!): DataSource
        updateDataSource(id: Int!, name: String!, type: DataSourceType!, config: String!): DataSource
        updateSchema(id: Int!, schema: String!): Schema
        upsertResolver(
            id: Int
            schemaId: Int!
            dataSourceId: Int! 
            type: String!,
            field: String!
            requestMapping: String!
            responseMapping: String!
        ): Resolver
    },  
    type DataSource {
        id: Int!
        name: String!
        type: DataSourceType! 
        config: String!
        resolvers: [Resolver]
    },
    type Schema {
        id: Int!
        name: String!
        schema: String!
        valid: Boolean!
        compiled: String!
        resolvers: [Resolver]        
    },
    type Resolver {
        id: Int! 
        type: String!
        field: String!
        requestMapping: String!
        responseMapping: String!
        DataSource: DataSource!
    }
`);

const createDataSource = async ({ name, type, config }) => {
    info("createDataSource request");
    const created = await dataSource.create({
        name,
        type,
        config
    });

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    return created;
};

const listDataSources = ({ name }) => {
    info("listDataSources request");
    if (name) {
        const operator = supportsiLike() ? database.Op.iLike : database.Op.like;
        return dataSource.findAll({ where: { name: { [operator]: `%${name}%` } } });
    }
    return dataSource.findAll();
};

const listResolvers = ({ schemaId, type }) => resolver.findAll({
    where: {
        GraphQLSchemaId: schemaId,
        type
    },
    include: {
        model: dataSource,
        as: "DataSource"
    }
});

const upsertResolver = async ({
    id, schemaId, dataSourceId, type, field,
    requestMapping, responseMapping
}) => {
    const properties = {
        GraphQLSchemaId: schemaId,
        DataSourceId: dataSourceId,
        requestMapping,
        responseMapping,
        type,
        field
    };

    if (id) {
        const updated = await resolver.findById(id);
        return updated.update(properties);
    }
    return resolver.create(properties);
};

const getOneDataSource = ({ id }) => {
    info("getOneDataSource request");
    return dataSource.findById(id);
};

const deleteDataSource = async ({ id }) => {
    info(`deleteDataSource request for id ${id}`);

    const foundDataSource = await dataSource.findById(id);
    if (!foundDataSource) {
        return null;
    }

    const destroyed = await foundDataSource.destroy({ force: true });
    info(`Data source with id ${destroyed.id} deleted`);

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    return foundDataSource;
};

const updateDataSource = async ({ id, name, type, config }) => {
    info("updateDataSource request");
    const current = await dataSource.findById(id);
    const updated = await current.update({
        name,
        type,
        config
    });

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    return updated;
};

const getSchema = async ({ name }) => {
    info("getSchema request");

    const [defaultSchema, created] = await schema.findOrCreate({
        where: { name },
        defaults: {
            schema: "# Add your schema here"
        }
    });

    if (created) {
        info(`Created a new default with name ${name}`);
    }

    // Compile the schema on the fly...
    let compiled = "";
    let valid = false;
    try {
        compiled = await compileSchemaString(defaultSchema.schema);
        valid = true;
    } catch (err) {
        warn("Schema not valid: ", err);
    }

    // ...and add the result to the response object
    defaultSchema.compiled = JSON.stringify(compiled);
    defaultSchema.valid = valid;
    return defaultSchema;
};

const updateSchema = async args => {
    info("updateSchema request");

    try {
        const compiled = await compileSchemaString(args.schema);
        if (compiled.errors) {
            return new Error(formatGraphqlErrors(compiled));
        }

        const currentSchema = await schema.findById(args.id);
        const updatedSchema = await currentSchema.update({
            schema: args.schema
        });

        publish(DEFAULT_CHANNEL, { reload: "Schema" });
        return {
            id: updatedSchema.id,
            name: updatedSchema.name,
            schema: updatedSchema.schema,
            compiled: JSON.stringify(compiled)
        };
    } catch (err) {
        error(`Error updating schema with id ${args.id}`, err);
        return err;
    }
};

const root = {
    dataSources: listDataSources,
    resolvers: listResolvers,
    upsertResolver,
    createDataSource,
    getOneDataSource,
    deleteDataSource,
    updateDataSource,
    updateSchema,
    getSchema
};

module.exports = { Schema, root };
