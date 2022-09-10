import express from "express";
import mariadb from "mariadb";

const dbPool = mariadb.createPool({
	host: process.env.DB_HOST ?? "localhost",
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASS ?? "root",
	database: process.env.DB_NAME ?? "data",
});

dbPool.execute(`
	CREATE TABLE IF NOT EXISTS \`items\` (
		\`ID\`       INT  AUTO_INCREMENT,
		\`Name\`     TEXT NOT NULL,
		\`Obtained\` BOOL NOT NULL,
		PRIMARY KEY (\`ID\`)
	)
`);

const server = express();
server.use(express.static("public"));
server.listen(process.env.WEB_PORT ?? "3000");
