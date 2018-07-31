const { urlencoded, json } = require("body-parser");
const express = require("express");
const { join } = require("path");
const { log } = require("./logger");
const { expressPino } = require("./logger");
const { port } = require("./config");
const { sync, database, schema } = require("./models");
const { stopNotifications } = require("./configNotifiers/configNotifierCreator");
const { runHealthChecks } = require("./health");
const setupGraphQLServer = require("./gql");
const { compileSchemaString } = require("./gql/helper");

const App = express();
let server = null;

// Set-up payload parsers. We accept url encoded and json values
App.use(urlencoded({ extended: false }));
App.use(json());

App.use(express.static(join(__dirname, "../public")));
App.use(expressPino);

App.get("/", (req, res) => res.sendFile(join(__dirname, "../public/index.html")));
App.get("/healthz", (req, res) => {
    runHealthChecks().then(result => {
        res.status(result.ok ? 200 : 503);
        return res.json(result);
    }).catch(err => {
        log.error(err);
        return res.sendStatus(500);
    });
});

setupGraphQLServer(App);

App.get("/schema/:schemaId", async (req, res) => {
    try {
        const s = await schema.findById(req.params.schemaId);
        if (s) {
            const compiled = await compileSchemaString(s.schema);
            const filename = `schema_${s.name}.json`;
            // tell the browser to handle this as a file download
            res.setHeader("Content-disposition", `attachment; filename=${filename}`);
            res.setHeader("Content-type", "text/json");
            res.status(200).send(JSON.stringify(compiled, null, 2));
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        log.error(err);
        res.sendStatus(500);
    }
});

// Catch all other requests and return "Not found"
App.get("*", (_, res) => res.sendStatus(404));

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
            server.close(() => callback());
        });
};

process.on("SIGTERM", exports.stop);
process.on("SIGABRT", exports.stop);
process.on("SIGQUIT", exports.stop);
process.on("SIGINT", exports.stop);
