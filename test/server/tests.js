import { agent } from "supertest";
import { run, stop } from "../../server/server";
import { graphql } from "graphql";
import { Schema, root } from "../../server/gql/schema";

function assert(condition) {
    if (!condition) return new Error(`${condition} was not truthy`);
}

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

    const CREATE_DATASOURCE_QUERY = ` 
        mutation createDataSource {
          createDataSource(
            name: "TestDataSource"
            type: Postgres
            config: "config: test"
          ) {
            id
            name
            type
            config
          }
        }
    `;

    const GET_DATA_SOURCES_QUERY = `
       query getDataSourcesQuery {
         dataSources {
            id
            name
            type
            config
          }
       }
    `

    it('should create a new data source', done => {
        graphql(Schema, CREATE_DATASOURCE_QUERY, root)
            .then(data => {
            let { createDataSource: { name, type, config }  } = data.data;
            let err = assert(data !== undefined)
            || assert(name === "TestDataSource")
            || assert(type === "Postgres")
            || assert(typeof config === typeof "");
            let createdDataSource = data;
            return {createdDataSource, err};
            })
            .then((createdDataSource, err) => {
                graphql(Schema, GET_DATA_SOURCES_QUERY, root)
                    .then((result) => {
                        assert(result.data.dataSources[0].name === "TestDataSource");
                    })
                done(err);
            })
            .catch(err => {
            throw err;
        });
    });

});
