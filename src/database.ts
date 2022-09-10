import mariadb from "mariadb";

const dbPool = mariadb.createPool({
	host: process.env.DB_HOST ?? "localhost",
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASS ?? "root",
	database: process.env.DB_NAME ?? "data",
});

export const setup = async (): Promise<void> => {
	return dbPool.execute(`
		CREATE TABLE IF NOT EXISTS \`items\` (
			\`ID\`       INT  AUTO_INCREMENT,
			\`Name\`     TEXT NOT NULL,
			\`Obtained\` BOOL NOT NULL,
			PRIMARY KEY (\`ID\`)
		);
	`);
};

export default {
	setup: setup,
};
