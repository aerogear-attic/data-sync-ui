const { graphql } = require("graphql");
const { Schema, root } = require("../../server/gql/schema");
const { run, stop } = require("../../server/server");
const { reset, sync } = require("../../server/models");
const {
    CREATE_DATA_SOURCE,
    GET_DATA_SOURCES,
    GET_DATA_SOURCE,
    DELETE_DATA_SOURCE,
    UPDATE_DATA_SOURCE,
    GET_SCHEMAS,
    GET_SCHEMA,
    UPDATE_SCHEMA,
    GET_RESOLVERS,
    UPSERT_RESOLVER
} = require("./queries");

beforeAll(done => {
    run(() => done());
});

afterAll(done => {
    stop(() => done());
});

afterEach(async () => {
    await reset();
    await sync();
});

const dataSource = {
    name: "test",
    type: "Postgres",
    config: { timestamps: true },
    resolvers: []
};

const resolver = {
    type: "type",
    field: "field",
    requestMapping: "",
    responseMapping: ""
};

describe("DataSources", () => {
    it("should not have any data sources by default", async () => {
        const fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(0);
    });

    it("should create a new data source", async () => {
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        const fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(1);
        expect(fetch.data.dataSources[0]).toEqual({ id: 1, ...dataSource });
    });

    it("should delete an existing data source", async () => {
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        let fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(1);
        expect(fetch.data.dataSources[0]).toEqual({ id: 1, ...dataSource });

        await graphql(Schema, DELETE_DATA_SOURCE, root, null, { id: 1 });

        fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(0);
    });

    it("should get one data source by its id", async () => {
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        const result = await graphql(Schema, GET_DATA_SOURCE, root, null, { id: 1 });
        expect(result.errors).toBeUndefined();
        expect(result.data.getOneDataSource).toEqual({ id: 1, ...dataSource });
    });

    it("should edit an existing data source", async () => {
        const updatedDataSource = {
            id: 1,
            name: "updated!",
            type: "InMemory",
            config: { timestamps: false },
            resolvers: []
        };

        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        let fetch = await graphql(Schema, GET_DATA_SOURCE, root, null, { id: 1 });
        expect(fetch.data.getOneDataSource).toEqual({ id: 1, ...dataSource });

        await graphql(Schema, UPDATE_DATA_SOURCE, root, null, updatedDataSource);

        fetch = await graphql(Schema, GET_DATA_SOURCE, root, null, { id: 1 });
        expect(fetch.data.getOneDataSource).toEqual({ id: 1, ...updatedDataSource });
    });
});

describe("Schemas", () => {
    it("should not have any schemas by default", async () => {
        const fetch = await graphql(Schema, GET_SCHEMAS, root);
        expect(fetch.data.schemas).toHaveLength(0);
    });

    it("should create an empty schema when fetching a non existent one", async () => {
        let fetch = await graphql(Schema, GET_SCHEMAS, root);
        expect(fetch.data.schemas).toHaveLength(0);

        fetch = await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });
        expect(fetch.data.getSchema).toBeDefined();
        expect(fetch.data.getSchema.name).toEqual("test");
        expect(fetch.data.getSchema.schema).toEqual("# Add your schema here");
        expect(fetch.data.getSchema.compiled).toEqual(JSON.stringify(""));

        fetch = await graphql(Schema, GET_SCHEMAS, root);
        expect(fetch.data.schemas).toHaveLength(1);
    });

    it("should update a schema", async () => {
        const schema = `
            type Note {
                id: Int,
                name: String
            }
    
            type Query {
                notes: [Note]
            }
        `;

        let fetch = await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });
        expect(fetch.data.getSchema.name).toEqual("test");
        expect(fetch.data.getSchema.schema).toEqual("# Add your schema here");

        await graphql(Schema, UPDATE_SCHEMA, root, null, { id: 1, schema });

        fetch = await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });
        expect(fetch.data.getSchema.name).toEqual("test");
        expect(fetch.data.getSchema.schema).toEqual(schema);
    });
});

describe("Resolvers", () => {
    it("should not have any resolvers by default", async () => {
        const fetch = await graphql(Schema, GET_RESOLVERS, root, null, { schemaId: 1, type: "type" });
        expect(fetch.data.resolvers).toHaveLength(0);
    });

    it("should throw an error if creating a resolver without schema", async () => {
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        let fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(1);

        fetch = await graphql(Schema, GET_SCHEMAS, root);
        expect(fetch.data.schemas).toHaveLength(0);

        const create = await graphql(Schema, UPSERT_RESOLVER, root, null, {
            schemaId: 1, dataSourceId: 1, ...resolver
        });
        expect(create.errors).toHaveLength(1);
    });

    it("should throw an error if creating a resolvers without a data source", async () => {
        await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });

        let fetch = await graphql(Schema, GET_SCHEMAS, root);
        expect(fetch.data.schemas).toHaveLength(1);

        fetch = await graphql(Schema, GET_DATA_SOURCES, root);
        expect(fetch.data.dataSources).toHaveLength(0);

        const create = await graphql(Schema, UPSERT_RESOLVER, root, null, {
            schemaId: 1, dataSourceId: 1, ...resolver
        });
        expect(create.errors).toHaveLength(1);
    });

    it("should create a resolver and attach it to a data source", async () => {
        await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        await graphql(Schema, UPSERT_RESOLVER, root, null, {
            schemaId: 1, dataSourceId: 1, ...resolver
        });

        const fetch = await graphql(Schema, GET_DATA_SOURCE, root, null, { id: 1 });
        expect(fetch.data.getOneDataSource.resolvers).toHaveLength(1);
        expect(fetch.data.getOneDataSource.resolvers[0]).toEqual({ id: 1, ...resolver });
    });

    it("should create a resolver", async () => {
        await graphql(Schema, GET_SCHEMA, root, null, { name: "test" });
        await graphql(Schema, CREATE_DATA_SOURCE, root, null, dataSource);

        await graphql(Schema, UPSERT_RESOLVER, root, null, {
            schemaId: 1, dataSourceId: 1, ...resolver
        });

        const fetch = await graphql(Schema, GET_RESOLVERS, root, null, {
            schemaId: 1, type: resolver.type
        });
        expect(fetch.data.resolvers).toHaveLength(1);
    });
});
