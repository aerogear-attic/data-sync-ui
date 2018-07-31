const { agent } = require("supertest");
const { run, stop } = require("../../server/server");

let user = null;

beforeAll(done => {
    run(app => {
        user = agent(app);
        done();
    });
});

afterAll(done => {
    stop(() => done());
});

it("should serve the ui", async () => {
    const res = await user.get("/");
    expect(res.status).toEqual(200);
});

it("should expose a health endpoint", async () => {
    const res = await user.get("/healthz");
    expect(res.status).toEqual(200);
});
