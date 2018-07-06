import { agent } from "supertest";
import { graphql } from "graphql";
import { run, stop } from "../../server/server";
import { Schema, root } from "../../server/gql/schema";
import { queries } from "./queries";

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
});
