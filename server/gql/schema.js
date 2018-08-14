const { buildSchema } = require("graphql");
const { log, auditLog } = require("../logger");
const { dataSource, database, supportsiLike, schema, resolver } = require("../models");
const { compileSchemaString, formatGraphqlErrors } = require("./helper");
const { publish, DEFAULT_CHANNEL } = require("../configNotifiers/configNotifierCreator");
const dataSourceValidator = require("../dataSourceValidator/dataSourceValidator");

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory,
        Postgres
    },
    type Query {
        dataSources(name: String): [DataSource]
        getOneDataSource(id: Int!): DataSource
        schemas: [Schema]
        getSchema(name: String!): Schema
        resolvers(schemaId: Int!, type: String):[Resolver]
        getDataSourceTestResult(type: DataSourceType!, config: JSON!): DataSourceTestResult
    },
    type Mutation {
        createDataSource(name: String!, type: DataSourceType!, config: JSON!): DataSource
        deleteDataSource(id: Int!): DataSource
        updateDataSource(id: Int!, name: String!, type: DataSourceType!, config: JSON!): DataSource
        updateSchema(id: Int!, schema: String!): Schema
        upsertResolver(
            id: Int
            schemaId: Int!
            dataSourceId: Int! 
            type: String!,
            field: String!
            preHook: String
            postHook: String
            requestMapping: String!
            responseMapping: String
            publish: String
        ): Resolver
        deleteResolver(id: Int!): Resolver
    },  
    type DataSource {
        id: Int!
        name: String!
        type: DataSourceType! 
        config: JSON!
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
        GraphQLSchemaId: Int!
        type: String!
        field: String!
        preHook: String
        postHook: String
        requestMapping: String!
        responseMapping: String!
        DataSource: DataSource!
        publish: String
    },
    type DataSourceTestResult {
        status: Boolean!
        message: String
    }

    scalar JSON
`);

const createDataSource = async ({ name, type, config }) => {
    const created = await dataSource.create({
        name,
        type,
        config
    });

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    auditLog({
        operation: "createDataSource",
        name,
        type,
        config
    });
    return created;
};

const listDataSources = ({ name }) => {
    if (name) {
        const operator = supportsiLike() ? database.Op.iLike : database.Op.like;
        return dataSource.findAll({ where: { name: { [operator]: `%${name}%` } } });
    }

    return dataSource.findAll({
        include: [{ all: true }]
    });
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

const getOneResolver = ({ id }) => resolver.findById(id, {
    include: [{ all: true }]
});

const upsertResolver = async ({
    id, schemaId, dataSourceId, type, field, preHook = "", postHook = "",
    requestMapping, responseMapping = "", publish
}) => {
    const properties = {
        GraphQLSchemaId: schemaId,
        DataSourceId: dataSourceId,
        preHook,
        postHook,
        requestMapping,
        responseMapping,
        type,
        field
        publish
    };

    let result;
    if (id) {
        const updated = await resolver.findById(id);
        result = updated.update(properties);
    } else {
        result = resolver.create(properties);
    }

    publish(DEFAULT_CHANNEL, { reload: "Resolver" });
    auditLog({
        operation: "upsertResolver",
        id,
        type,
        field,
        config: properties
    });

    // Don't return the result directly because including associations
    // doesn't seem to work with create/update
    return result.then(r => getOneResolver(r));
};

const deleteResolver = async ({ id }) => {
    const foundResolver = await resolver.findById(id);
    if (!resolver) {
        return null;
    }

    const destroyedResolver = await foundResolver.destroy({ force: true });
    log.info(`Resolver with id ${destroyedResolver.id} deleted`);

    publish(DEFAULT_CHANNEL, { reload: "Resolver" });
    auditLog({
        operation: "deleteResolver",
        id,
        type: foundResolver.type,
        field: foundResolver.field
    });
    return foundResolver;
};


const getOneDataSource = ({ id }) => dataSource.findById(id, {
    include: [{ all: true }]
});

const deleteDataSource = async ({ id }) => {
    const foundDataSource = await dataSource.findById(id);
    if (!foundDataSource) {
        return null;
    }

    const destroyed = await foundDataSource.destroy({ force: true });
    log.info(`Data source with id ${destroyed.id} deleted`);

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    auditLog({
        operation: "deleteDataSource",
        id,
        name: foundDataSource.name,
        type: foundDataSource.type,
        config: foundDataSource.config
    });
    return foundDataSource;
};

const updateDataSource = async ({ id, name, type, config }) => {
    const current = await dataSource.findById(id);
    const updated = await current.update({
        name,
        type,
        config
    });

    publish(DEFAULT_CHANNEL, { reload: "DataSource" });
    auditLog({
        operation: "updateDataSource",
        id,
        name,
        type,
        config
    });
    return updated;
};

const listSchemas = async () => schema.findAll({
    include: [{ all: true }]
});

const getDataSourceTestResult = async ({ type, config }) => dataSourceValidator(type, config);

const getSchema = async ({ name }) => {
    const [defaultSchema, created] = await schema.findOrCreate({
        where: { name },
        defaults: {
            schema: "# Add your schema here"
        }
    });

    if (created) {
        log.info(`Created a new default with name ${name}`);
    }

    // Compile the schema on the fly...
    let compiled = "";
    let valid = false;
    try {
        compiled = await compileSchemaString(defaultSchema.schema);
        valid = true;
    } catch (err) {
        log.warn("Schema not valid: ", err);
    }

    // ...and add the result to the response object
    defaultSchema.compiled = JSON.stringify(compiled);
    defaultSchema.valid = valid;
    return defaultSchema;
};

const updateSchema = async args => {
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
        auditLog({
            operation: "updateSchema",
            id: args.id,
            name: updatedSchema.name,
            type: updatedSchema.schema
        });
        return {
            id: args.id,
            name: updatedSchema.name,
            schema: updatedSchema.schema,
            compiled: JSON.stringify(compiled)
        };
    } catch (err) {
        log.error(`Error updating schema with id ${args.id}`, err);
        return err;
    }
};

const root = {
    dataSources: listDataSources,
    resolvers: listResolvers,
    upsertResolver,
    deleteResolver,
    createDataSource,
    getOneDataSource,
    getDataSourceTestResult,
    deleteDataSource,
    updateDataSource,
    updateSchema,
    schemas: listSchemas,
    getSchema
};

module.exports = { Schema, root };
