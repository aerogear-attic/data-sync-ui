const { urlencoded, json } = require("body-parser");
const express = require("express");
const { join } = require("path");
const { log, expressPino } = require("./logger");
const { port } = require("./config");
const { sequelize } = require("./gql/models");
const { stopNotifications } = require("./configNotifiers/configNotifierCreator");
const serverApi = require("./routes");

const applyExecutionLayerForSchema = require("./executionLayer");

const App = express();

const schemaName = "default";

// Set-up payload parsers. We accept url encoded and json values
App.use(urlencoded({ extended: false }));
App.use(json());

App.use(express.static(join(__dirname, "../public")));
App.use(expressPino);


let server = null;

App.use("/", serverApi());

async function setup() {
    try {
        await applyExecutionLayerForSchema(App, schemaName);
    } catch (error) {
        log.error("Could not apply middleware.", error);
    }
}

// FIXME: app start/close logic needs to wrap DB initialization, otherwise it is
// not usable after calling stop().
exports.run = callback => {
    setup().then(() => {
        sequelize.sync().then(() => {
            server = App.listen(port, () => callback(App));
        });
    });
};

exports.stop = callback => {
    log.info("Shutting down UI server");
    stopNotifications();
    sequelize.close()
        .then(() => {
            server.close(() => {
                if (typeof callback === "function") {
                    callback();
                }
            });
        });
};

process.on("SIGTERM", exports.stop);
process.on("SIGABRT", exports.stop);
process.on("SIGQUIT", exports.stop);
process.on("SIGINT", exports.stop);
