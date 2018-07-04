import { urlencoded, json } from "body-parser";
import express from "express";
import { join } from "path";
import { port } from "./config";
import { sync, database } from "./models";
import { init as pubSubInit, stop as pubSubStop } from "./pubsub";
import setupGraphQLServer from "./gql";

const App = express();
let server = null;

// Set-up payload parsers. We accept url encoded and json values
App.use(urlencoded({ extended: false }));
App.use(json());

App.use(express.static(join(__dirname, "../public")));

App.get("/", (req, res) => res.sendFile(join(__dirname, "../public/index.html")));

setupGraphQLServer(App);

// Catch all other requests and return "Not found"
App.get("*", (_, res) => res.sendStatus(404));

export const run = callback => {
    sync().then(() => {
    	pubSubInit();
    	server = App.listen(port, () => callback(App));
	});
};

export const stop = () => {
    server.close();
    pubSubStop();
    database.close();
};
