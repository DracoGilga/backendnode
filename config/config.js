module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "mysql",
	},
	test: {
		username: process.env.TEST_DB_USER,
		password: process.env.TEST_DB_PASSWORD,
		database: process.env.TEST_DB_DATABASE,
		host: process.env.TEST_DB_HOST,
		port: process.env.TEST_DB_PORT,
		dialect: "mysql",
	},
	production: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_NAME,
		host: process.env.PROD_DB_HOSTNAME,
		port: process.env.PROD_DB_PORT,
		dialect: "mysql",
	},
};
