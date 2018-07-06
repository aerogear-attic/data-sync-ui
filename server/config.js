export const port = 8080;
export const logging = { level: "info" };
export const graphql = { debug: true };
export const postgresConfig = {
    database: process.env.POSTGRES_DATABASE || "aerogear_data_sync_db",
    username: process.env.POSTGRES_USERNAME || "postgresql",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: process.env.POSTGRES_PORT || "5432",
    logSql: false
};


export const notfier = {
    enabled: process.env.NODE_ENV !== "test",
    type: "postgres",
    config: {
        channel: "aerogear-data-sync-config",
        database: postgresConfig.database,
        username: postgresConfig.username,
        password: postgresConfig.password,
        host: postgresConfig.host,
        port: postgresConfig.port
    }
};
