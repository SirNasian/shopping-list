import mariadb from "mariadb";

const dbPool = mariadb.createPool({
	host: process.env.DB_HOST ?? "localhost",
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASS ?? "root",
	database: process.env.DB_NAME ?? "data",
});

export interface Item {
	ID: number;
	Name: string;
	Obtained: boolean;
}

export const getItems = async (): Promise<Item[]> =>
	await dbPool.query("SELECT * FROM `items`;");

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

export const updateItems = async (items: Item[]): Promise<boolean> => {
	const queries = items.map((item: Item) => {
		if (item.ID === -1 && item.Name !== undefined)
			return `INSERT INTO \`items\` (\`Name\`, \`Obtained\`) VALUES ("${item.Name}", 0)`;

		if (
			item.ID !== undefined &&
			(item.Name !== undefined || item.Obtained !== undefined)
		)
			return `
			UPDATE \`items\` SET
			${item.Name === undefined ? `` : `\`Name\` = "${item.Name}"`}
			${item.Obtained === undefined ? `` : `\`Obtained\` = "${item.Obtained}"`}
			WHERE \`ID\` = ${item.ID}
		`;
	});

	return await dbPool
		.execute(queries.join(";"))
		.then(() => true)
		.catch(() => false);
};

export default {
	getItems: getItems,
	setup: setup,
	updateItems: updateItems,
};
