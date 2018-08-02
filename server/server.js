const { urlencoded, json } = require("body-parser");
const express = require("express");
const { join } = require("path");
const { log, expressPino } = require("./logger");
const { port } = require("./config");
const { sync, database } = require("./models");
const { stopNotifications } = require("./configNotifiers/configNotifierCreator");
const router = require("./routes");

const App = express();

// Set-up payload parsers. We accept url encoded and json values
App.use(urlencoded({ extended: false }));
App.use(json());

App.use(express.static(join(__dirname, "../public")));
App.use(expressPino);

App.use("/", router);

let server = null;

// FIXME: app start/close logic needs to wrap DB initialization, otherwise it is
// not usable after calling stop().
exports.run = callback => {
    sync().then(() => {
        server = App.listen(port, () => callback(App));
    });
};

exports.stop = callback => {
    log.info("Shutting down UI server");
    stopNotifications();
    database.close()
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
