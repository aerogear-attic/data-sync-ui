const {buildSchema} = require("graphql");
const {info, warn, error} = require("../logger");
const {dataSource, database, supportsiLike, schema} = require("../models");
const { compileSchemaString, formatGraphqlErrors } = require("./helper");

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
    },  
    type DataSource {
        id: Int!
        name: String!
        type: DataSourceType! 
        config: String!
    },
    type Schema {
        id: Int!
        name: String!
        schema: String!
        valid: Boolean!
        compiled: String!        
    }
`);

const createDataSource = ({name, type, config}) => {
    info("createDataSource request");
    return dataSource.create({
        name,
        type,
        config
    });
};

const listDataSources = ({name}) => {
    info("listDataSources request");
    if (name) {
        const operator = supportsiLike() ? database.Op.iLike : database.Op.like;
        return dataSource.findAll({where: {name: {[operator]: `%${name}%`}}});
    }
    return dataSource.findAll();
};

const getOneDataSource = ({id}) => {
    info("getOneDataSource request");
    return dataSource.findById(id);
};

const deleteDataSource = ({id}) => {
    info(`deleteDataSource request for id ${id}`);
    return dataSource.findById(id)
        .then(foundDataSource => {
            if (!foundDataSource) {
                return null;
            }
            return foundDataSource.destroy({ force: true }).then(() => foundDataSource);
        });
};

const updateDataSource = ({id, name, type, config}) => {
    info("updateDataSource request");
    return dataSource.findById(id).then(foundDataSource => foundDataSource.update({
        name,
        type,
        config
    }));
};

const getSchema = async ({name}) => {
    info("getSchema request");

    const [defaultSchema, created] = await schema.findOrCreate({
        where: {name},
        defaults: {
            schema: "# Add your schema here"
        }
    });

    if (created) {
        info(`Created a new default with name ${name}`);
    }

    // Compile the schema on the fly...
    let compiled = "", valid = false;
    try {
        compiled = await compileSchemaString(defaultSchema.schema);
        valid = true;
    } catch (err) {
        warn("Schema not valid: ", err);
    }

    // ...and add the result to the response object
    defaultSchema.compiled = compiled;
    defaultSchema.valid = valid;
    return defaultSchema;
};

const updateSchema = async (args) => {
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

        return {
            id: updatedSchema.id,
            name: updatedSchema.name,
            schema: updatedSchema.schema,
            compiled
        };
    } catch (err) {
        error(`Error updating schema with id ${args.id}`, err);
        return err;
    }

    // Compile the schema for validation purposes
    /*
    return compileSchemaString(args.schema).then(() => {
        return schema.findById(args.id).then(schema => {
            return schema.update({ schema: args.schema });
        });
    });
    */
};

const root = {
    dataSources: listDataSources,
    createDataSource,
    getOneDataSource,
    deleteDataSource,
    updateDataSource,
    updateSchema,
    getSchema
};

module.exports = {Schema, root};
