const { port } = require("./config");
const { log } = require("./logger");
const { run } = require("./server");

const Banner = "AeroGear Sync UI";

run(() => {
    log.info(`${Banner} running on port ${port}`);
});
