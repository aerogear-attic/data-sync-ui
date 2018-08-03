const { Client } = require("pg");

const CONN_TIMEOUT_IN_MS = 10000;

function connectClient(client) {
    // Node Postgres lib doesn't support timeouts on initial connection.
    // needed to do it manually
    return new Promise(((resolve, reject) => {
        let timedOut = false;

        const connTimeout = setTimeout(() => {
            timedOut = true;
            reject(new Error(`Unable to connect to host after ${CONN_TIMEOUT_IN_MS} milliseconds`));
        }, CONN_TIMEOUT_IN_MS);


        client.connect(err => {
            clearTimeout(connTimeout);

            if (timedOut) {
                return;
            }

            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }));
}

module.exports = async config => {
    let client;

    try {
        client = new Client({
            user: config.options.username,
            host: config.options.url,
            database: config.options.database,
            password: config.options.password,
            port: config.options.port,
            // this is used when test query is executed, not when connection is initialized
            statement_timeout: CONN_TIMEOUT_IN_MS
        });
    } catch (ex) {
        return { status: false, message: `Postgres data source config has a bad format: ${ex.message}` };
    }

    try {
        try {
            await connectClient(client);
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
            // force kill the connection if it is open or end it if it is not
            // see https://github.com/brianc/node-pg-pool/blob/277dc508daea03a8f6c0bcc3c534cab5b2501b12/index.js#L208-L209
            try {
                // do not block on ending the client
                if (client.connection) {
                    client.connection.stream.destroy();
                } else {
                    client.end();
                }
            } catch (ex) {
                // do nothing even when there's an error.
            }
        }
    }
};
