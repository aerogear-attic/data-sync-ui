const { Client } = require("pg");

module.exports = async config => {
    let client;

    try {
        client = new Client({
            user: config.username,
            host: config.host,
            database: config.database,
            password: config.password,
            port: config.port
        });
    } catch (ex) {
        return { status: false, message: `Postgres data source config has a bad format: ${ex.message}` };
    }

    try {
        try {
            await client.connect();
        } catch (ex) {
            return { status: false, message: `Unable to connect to Postgres data source: ${ex.message}` };
        }

        try {
            await client.query("SELECT 1");
        } catch (ex) {
            return { status: false, message: `Error while testing connection ${ex.message}` };
        }

        return { status: true };
    } finally {
        if (client) {
            try {
                await client.end();
            } catch (ex) {
                // swallow this. nothing to report because connection ending didn't work
            }
        }
    }
};
