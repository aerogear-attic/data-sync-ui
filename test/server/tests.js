import "babel-polyfill";

import { agent } from "supertest";
import { run, stop } from "../../server/server";

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
});
