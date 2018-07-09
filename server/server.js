import { urlencoded, json } from "body-parser";
import express from "express";
import { join } from "path";
import { port } from "./config";
import { sync, database } from "./models";
import { close as stopNotifier } from "./configNotifiers/configNotifierCreator";
import { runHealthChecks } from "./health";
import { info, error } from "./logger";
import setupGraphQLServer from "./gql";

const App = express();
let server = null;

// Set-up payload parsers. We accept url encoded and json values
App.use(urlencoded({ extended: false }));
App.use(json());

App.use(express.static(join(__dirname, "../public")));

App.get("/", (req, res) => res.sendFile(join(__dirname, "../public/index.html")));
App.get("/healthz", (req, res) => {
    runHealthChecks().then(result => {
        res.status(result.ok ? 200 : 503);
        return res.json(result);
    }).catch(err => {
        error(err);
        return res.sendStatus(500);
    });
});

setupGraphQLServer(App);

// Catch all other requests and return "Not found"
App.get("*", (_, res) => res.sendStatus(404));

export const run = callback => {
    sync().then(() => {
        server = App.listen(port, () => callback(App));
    });
};

export const stop = () => {
    info("Shutting down UI server");
    server.close();
    stopNotifier();
    database.close();
};

process.on("SIGTERM", stop);
process.on("SIGABRT", stop);
process.on("SIGQUIT", stop);
process.on("SIGINT", stop);
