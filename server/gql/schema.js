const {buildSchema} = require("graphql");
const {info, warn} = require("../logger");
const {dataSource, database, supportsiLike, schema} = require("../models");
const { compileSchemaString } = require("./helper");

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
        updateSchema(schema: String!): Schema
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
            schema: "# Add your Schema here"
        }
    });

    if (created) {
        info(`Created a new default with name ${name}`);
    }

    // Compile the schema on the fly...
    let compiled = "";
    try {
        compiled = await compileSchemaString(defaultSchema.schema);
    } catch (err) {
        warn("Schema not valid: ", err);
    }

    // ...and add the result to the response object
    defaultSchema.compiled = compiled;
    return defaultSchema;
};

const updateSchema = ({schema}) => {
    info("updateSchema request");

    // Compile the schema for validation purposes
    return compileSchemaString(schema).then(() => {
        return getSchema().then(schema => {
            return schema.update({
                schema: source
            });
        });
    });
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
