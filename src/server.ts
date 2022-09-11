import express from "express";

import database from "./database";

database.setup();

const server = express();
server.use(express.static("public"));
server.use(express.json());
server.get("/api/items", async (_req, res) =>
	res.send(await database.getItems())
);
server.post("/api/items", async (req, res) => {
	// TODO: send back slightly more useful information
	res.sendStatus((await database.updateItems(req.body)) ? 200 : 500);
});
server.delete("/api/items/:itemID", async (req, res) => {
	// TODO: send back slightly more useful information
	res.sendStatus((await database.deleteItem(Number(req.params.itemID))) ? 200 : 500);
});
server.listen(process.env.WEB_PORT ?? "3000");
