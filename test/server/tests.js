import { agent } from "supertest";
import { run, stop } from "../../server/server";

describe("Basic", () => {
    let user = null;

    before((done) => {
        App.run((instance) => {
            user = request.agent(instance);
            done();
        });
    });

    after((done) => {
        App.stop();
        done();
    });

    it("should serve the ui", (done) => {
        user.get("/")
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                done();
            });
    });
});
