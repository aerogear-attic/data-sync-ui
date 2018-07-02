"use strict";

const bodyParser = require("body-parser")
    , express = require("express")
    , { join } = require("path")
    , { port } = require("./config");

const App = express();
let server = null;

// Set-up payload parsers. We accept url encoded and json values
App.use(bodyParser.urlencoded({extended: false}));
App.use(bodyParser.json());

App.use(express.static(join(__dirname, "public")));

App.get("/", (req, res) => {
    return res.sendFile(join(__dirname, "index.html"));
});

// Setup GraphQl Server
require("./gql")(App);

// Catch all other requests and return "Not found"
App.get("*", (_, res) => {
    return res.sendStatus(404);
});

exports.run = function (callback) {
    server = App.listen(port, () => callback(App));
};

exports.stop = function() {
    server.close();
};
