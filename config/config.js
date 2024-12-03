module.exports = {
    development: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        dialect: "mysql",
    },
    test: {
        host: process.env.TEST_DB_HOST,
        database: process.env.TEST_DB_DATABASE,
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        port: process.env.TEST_DB_PORT,
        dialect: "mysql",
    },
    production: {
        host: process.env.PROD_DB_HOSTNAME,
        database: process.env.PROD_DB_DATABASE,
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        port: process.env.PROD_DB_PORT,
        dialect: "mysql",
    },
};
