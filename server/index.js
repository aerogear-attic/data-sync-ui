const { port } = require("./config");
const { info } = require("./logger");
const { run } = require("./server");

const Banner = "AeroGear Sync UI";

run(() => {
    info(`${Banner} running on port ${port}`);
});
