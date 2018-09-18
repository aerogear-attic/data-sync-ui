const core = require("@aerogear/data-sync-gql-core");
const { postgresConfig, sqLiteConfig } = require("../config");

let models;

if (process.env.NODE_ENV === "test") {
    models = core.models(sqLiteConfig);
} else {
    models = core.models(postgresConfig);
}
module.exports = models;
