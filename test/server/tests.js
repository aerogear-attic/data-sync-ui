const { agent } = require("supertest");
const { graphql } = require("graphql");
const { run, stop } = require("../../server/server");
const { Schema, root } = require("../../server/gql/schema");
const { queries } = require("./queries");

const assert = (condition, message) => {
    if (!condition) {
        return new Error(`${condition} was not truthy: ${message}`);
    }
    return; // eslint-disable-line
};

describe("Basic", () => {
    let user = null;

    before(done => {
        run(instance => {
            user = agent(instance);
            done();
        });
    });

    after(done => {
        stop();
        done();
    });

    it("should serve the ui", done => {
        user.get("/")
            .expect(200)
            .end(err => {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it("should expose a health endpoint", done => {
        user.get("/healthz")
            .expect(200)
            .end(err => {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it("should delete a new data source", done => {
        graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
            .then(data => {
                const { createDataSource: { id, name, type, config } } = data.data;
                const msg = "error creating datasource - problem with: ";
                const err = assert(data !== undefined, `${msg}data is undefined`)
                    || assert(name === "TestDataSource", msg + name)
                    || assert(type === "Postgres", msg + type)
                    || assert(typeof config === typeof "", msg + config);
                if (err) {
                    throw err;
                }
                return id;
            })
            .then(id => graphql(Schema, queries.DELETE_DATA_SOURCE_QUERY, root, null, { id }))
            .then(result => {
                // Check if the data source was actually deleted
                if (result.data.deleteDataSource === null) {
                    throw new Error("Delete data source failed");
                }
            })
            .then(() => graphql(Schema, queries.GET_DATA_SOURCES_QUERY, root))
            .then(result => {
                // Check that no more are present
                if (result.data.dataSources && result.data.dataSources.length === 0) {
                    done();
                } else {
                    throw new Error("Data source still present after delete");
                }
            })
            .catch(err => done(err));
    });

    it("should edit a new data source", done => {
        const NEW_NAME = "NEW DATA SOURCE NAME";
        graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
            .then(data => {
                const { createDataSource: { id, name, type, config } } = data.data;
                const msg = "error creating editing datasource - problem with: ";
                const err = assert(data !== undefined, msg + data)
                    || assert(name === "TestDataSource", msg + name)
                    || assert(type === "Postgres", msg + type)
                    || assert(typeof config === typeof "", msg + config);
                if (err) {
                    throw err;
                }
                return { id, name: NEW_NAME, type, config };
            })
            .then(result => graphql(Schema, queries.UPDATE_DATA_SOURCE_QUERY, root, null, result))
            .then(({ data: { updateDataSource } }) => {
                // Check if the data source was actually updated
                if (updateDataSource && updateDataSource.name === NEW_NAME) {
                    return done();
                }
                throw new Error("Update data source not successful");
            })
            .catch(err => done(err));
    });

    it("should edit a new data source", done => {
        const NEW_NAME = "NEW DATA SOURCE NAME";
        graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
            .then(data => {
                const { createDataSource: { id, name, type, config } } = data.data;
                const msg = "error creating editing datasource - problem with: ";
                const err = assert(data !== undefined, msg + data)
                    || assert(name === "TestDataSource", msg + name)
                    || assert(type === "Postgres", msg + type)
                    || assert(typeof config === typeof "", msg + config);
                if (err) {
                    throw err;
                }
                return { id, name: NEW_NAME, type, config };
            })
            .then(result => graphql(Schema, queries.UPDATE_DATA_SOURCE_QUERY, root, null, result))
            .then(({ data: { updateDataSource } }) => {
                // Check if the data source was actually updated
                if (updateDataSource && updateDataSource.name === NEW_NAME) {
                    return done();
                }
                throw new Error("Update data source not successful");
            })
            .catch(err => done(err));
    });

    it("should be able to create a schema and attach a resolver", done => {
        const schema = `
            type Note { 
                id: Int, 
                name: String
            }
            
            type Query {
                notes: [Note]
            }           
        `;

        graphql(Schema, queries.GET_SCHEMA, root, null, { name: "default" })
            .then(data => {
                const { getSchema: { id } } = data.data;
                if (!id) {
                    throw new Error("Schema not created");
                }
                return id;
            }).then(id => graphql(Schema, queries.UPDATE_SCHEMA, root, null, {
                id,
                schema
            }).then(data => ({ data, id }))).then(({ data, id }) => {
                const { updateSchema: { compiled } } = data.data;
                if (!compiled) {
                    throw new Error("Schema update failed");
                }
                return id;
            })
            .then(schemaId => graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
                .then(data => ({ schemaId, data })))
            .then(({ schemaId, data }) => {
                const { createDataSource: { id } } = data.data;
                return graphql(Schema, queries.UPSERT_RESOLVER, root, null, {
                    schemaId,
                    dataSourceId: id,
                    type: "Note",
                    field: "name",
                    requestMapping: "select * from notes",
                    responseMapping: "{{ context.result }}"
                });
            })
            .then(data => {
                const { upsertResolver: { id } } = data.data;
                if (!id) {
                    throw new Error("Resolver not created");
                }
                return done();
            })
            .catch(err => done(err));
    });
});
