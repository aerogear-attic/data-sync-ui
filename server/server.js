import { urlencoded, json } from "body-parser";
import express from "express";
import { join } from "path";
import { port } from "./config";
import { sync, database, schema } from "./models";
import { close as stopNotifier } from "./configNotifiers/configNotifierCreator";
import { runHealthChecks } from "./health";
import { info, error } from "./logger";
import setupGraphQLServer from "./gql";
import { compileSchemaString } from "./gql/helper";

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

App.get('/schema/:schemaId', async (req, res) => {
    try {
        const s = await schema.findById(req.params.schemaId)
        if (s) {
            const compiled = await compileSchemaString(s.schema)
            const filename=`schema_${s.name}.json`
            // tell the browser to handle this as a file download
            res.setHeader('Content-disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-type', 'text/json');
            res.status(200).send(JSON.stringify(compiled, null, 2))
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        error(error)
        res.sendStatus(500);
    }
})

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
