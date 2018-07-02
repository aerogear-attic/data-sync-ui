const App = require("../server")
    , request = require("supertest");

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
