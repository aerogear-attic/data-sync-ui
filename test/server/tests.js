import { agent } from "supertest";
import { graphql } from "graphql";
import { run, stop } from "../../server/server";
import { Schema, root } from "../../server/gql/schema";
import { queries } from "./queries";

const assert = condition => {
    if (!condition) {
        return new Error(`${condition} was not truthy`);
    }
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

    it("should delete a new data source", done => {
        let currentId = null;
        graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
            .then(data => {
                const { createDataSource: { name, type, config } } = data.data;
                const err = assert(data !== undefined)
            || assert(name === "TestDataSource")
            || assert(type === "Postgres")
            || assert(typeof config === typeof "");
                const createdDataSource = data;
                currentId = createdDataSource.data.createDataSource.id;
                return { createdDataSource, err };
            })
            .then(() => {
                const queryWithValidId = queries.DELETE_DATA_SOURCE_QUERY.replace("$id", currentId);
                return graphql(Schema, queryWithValidId, root)
                    .then(result => {
                        console.log("delete test result", result.data.deleteDataSource);
                        const err = assert(result.data.deleteDataSource === null);
                        return err;
                    });
            })
            .then(err => {
                graphql(Schema, queries.GET_DATA_SOURCES_QUERY, root)
                    .then(result => {
                        console.log("get data result", result.data);
                        return result;
                    });
                done(err);
            })
            .catch(err => ({ err }));
    });


    it("should edit a new data source", done => {
        let currentId = null;
        graphql(Schema, queries.CREATE_DATA_SOURCE_QUERY, root)
            .then(data => {
                const { createDataSource: { name, type, config } } = data.data;
                const err = assert(data !== undefined)
                    || assert(name === "TestDataSource")
                    || assert(type === "Postgres")
                    || assert(typeof config === typeof "");
                const createdDataSource = data;
                currentId = createdDataSource.data.createDataSource.id;
                return { createdDataSource, err };
            })
            .then((createdDataSource, err) => {
                const queryWithValidId = queries.UPDATE_DATA_SOURCE_QUERY.replace("$id", currentId);
                graphql(Schema, queryWithValidId, root)
                    .then(result => {
                        console.log("edit test result", result);
                    });
                done(err);
            })
            .catch(err => ({ err }));
    });
});
