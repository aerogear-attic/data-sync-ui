exports.port = 8080;
exports.graphql = { debug: true };
exports.postgresConfig = {
    database: process.env.POSTGRES_DATABASE || "aerogear_data_sync_db",
    username: process.env.POSTGRES_USERNAME || "postgresql",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: process.env.POSTGRES_PORT || "5432",
    logSql: false
};

exports.notifier = {
    enabled: process.env.NODE_ENV !== "test",
    type: "postgres",
    config: {
        channel: "aerogear-data-sync-config",
        database: exports.postgresConfig.database,
        username: exports.postgresConfig.username,
        password: exports.postgresConfig.password,
        host: exports.postgresConfig.host,
        port: exports.postgresConfig.port
    }
};

exports.auditLogConfig = {
    enabled: process.env.AUDIT_LOGGING !== "false" && process.env.AUDIT_LOGGING !== false,
    tag: "AUDIT"
};
