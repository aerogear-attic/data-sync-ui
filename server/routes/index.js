const router = require("express").Router();
const { join } = require("path");
const cors = require("cors");
const axios = require("axios");
const { runHealthChecks } = require("../health");
const { log } = require("../logger");
const { compileSchemaString } = require("../gql/helper");
const { schema } = require("../models");
const setupGraphQLServer = require("../gql");

router.get("/", (req, res) => res.sendFile(join(__dirname, "../public/index.html")));

router.get("/healthz", (req, res) => {
    runHealthChecks().then(result => {
        res.status(result.ok ? 200 : 503);
        return res.json(result);
    }).catch(err => {
        log.error(err);
        return res.sendStatus(500);
    });
});

router.get("/schema/:schemaId", async (req, res) => {
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

router.post("/testHook", cors(), async (req, res) => {
    const { hook } = req.body;
    try {
        const hookResponse = await axios.get(hook);
        res.sendStatus(hookResponse.status);
    } catch (err) {
        log.error(err);
        res.sendStatus(404);
    }
});

setupGraphQLServer(router);

// TODO: add graphql route here

module.exports = router;
