import {addCriticalTest, runTests} from "fh-health";
import { database } from "../models"

addCriticalTest("Database connectivity", cb => {
    database.authenticate()
        .then(() => {
            return cb(null, "Database connectivity check successful");
        })
        .catch(err => {
            return cb(err);
        });
});

export function addHealthEndpoint(App) {
    App.get("/healthz", (req, res) => {
        runTests((err, data) => {
            if (err) {
                return res.sendStatus(500)
            }

            return res.json(JSON.parse(data));
        });
    });
}