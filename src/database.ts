import mariadb from "mariadb";

const dbPool = mariadb.createPool({
	host: process.env.DB_HOST ?? "localhost",
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASS ?? "root",
	database: process.env.DB_NAME ?? "data",
});

export interface Item {
	ID: number;
	Name?: string;
	Obtained?: boolean;
}

export const createItem = async (item: Item): Promise<number> => {
	return Number(
		(
			await dbPool.execute(
				`INSERT INTO \`items\` (\`Name\`, \`Obtained\`) VALUES ("${item.Name}", 0)`
			)
		).insertId
	);
};

export const deleteItem = async (itemID: number): Promise<boolean> => {
	await dbPool.execute(`DELETE FROM \`items\` WHERE \`ID\` = ${itemID}`);
	return true;
};

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

export const updateItem = async (item: Item): Promise<boolean> => {
	if (!item.ID || (item.Name === undefined && item.Obtained === undefined))
		return false;
	return await dbPool
		.execute(
			`
				UPDATE \`items\` SET
				${item.Name === undefined ? `` : `\`Name\` = "${item.Name}"`}
				${item.Obtained === undefined ? `` : `\`Obtained\` = ${item.Obtained ? 1 : 0}`}
				WHERE \`ID\` = ${item.ID}
			`
		)
		.then(() => true)
		.catch(() => false);
};

export default {
	createItem: createItem,
	deleteItem: deleteItem,
	getItems: getItems,
	setup: setup,
	updateItem: updateItem,
};
