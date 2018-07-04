export const port = 8080;
export const logging = { level: "info" };
export const graphql = { debug: true };
export const postgresConfig = {
    database: process.env.POSTGRES_DATABASE || "postgres",
    username: process.env.POSTGRES_USERNAME || "postgres",
    password: process.env.POSTGRES_PASSWORD || "mysecretpassword",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: process.env.POSTGRES_PORT || "5432"
};
