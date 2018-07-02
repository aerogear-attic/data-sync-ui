"use strict";

const { port } = require("./config")
    , { info } = require("./logger")
    , { run } = require("./server");

const Banner = "AeroGear Sync UI";

run(() => {
    info(`${Banner} running on port ${port}`)
});
