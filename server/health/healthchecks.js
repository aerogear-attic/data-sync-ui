import { addCriticalTest, runTests } from "fh-health";
import { database } from "../models";

addCriticalTest("Database connectivity", cb => {
    database.authenticate()
        .then(() => cb(null, "Database connectivity check successful"))
        .catch(err => cb(err));
});

export function addHealthEndpoint(App) {
    App.get("/healthz", (req, res) => {
        runTests((err, data) => {
            if (err) {
                return res.sendStatus(500);
            }

            const result = JSON.parse(data);
            if (result.status !== "ok") {
                res.status(500);
            }
            return res.json(result);
        });
    });
}
