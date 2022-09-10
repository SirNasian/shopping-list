import express from "express";
import database from "./database";

database.setup();

const server = express();
server.use(express.static("public"));
server.get("/api/items", async (_req, res) =>
	res.send(await database.getItems())
);
server.listen(process.env.WEB_PORT ?? "3000");
