import { agent } from "supertest";
import { run, stop } from "../../server/server";
import { root } from "../../server/gql/schema";
import gql from "graphql-tag";

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

    const CREATE_DATASOURCE_QUERY = gql` 
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
    `

    it('should create a new data source', done => {

           done();
    });

});
