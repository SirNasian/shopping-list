import express from "express";
import websocket from "websocket";
import http from "http";

import database from "./database";
database.setup();

let wsConnections: websocket.connection[] = [];

new websocket.server({
	httpServer: http
		.createServer((_req, res) => {
			res.writeHead(404);
			res.end();
		})
		.listen(process.env.WS_PORT ?? 3001),
	autoAcceptConnections: false,
}).on("request", (req) => {
	const conn = req.accept();
	conn.on(
		"close",
		() => (wsConnections = wsConnections.filter((old_conn) => old_conn != conn))
	);
	wsConnections.push(conn);
});

const server = express();
server.use(express.static("public"));
server.use(express.json());
server.get("/api/items", async (_req, res) =>
	res.send(await database.getItems())
);
server.put("/api/items/-1", async (req, res) => {
	const itemID = await database.createItem(req.body);
	wsConnections.forEach((conn) =>
		conn.send(
			JSON.stringify({
				action: "createItem",
				item: {
					...req.body,
					ID: itemID,
					Obtained: req.body?.Obtained ?? false,
				},
			})
		)
	);
	// TODO: send back slightly more useful information
	res.sendStatus(itemID !== -1 ? 200 : 500);
});
server.put("/api/items/:itemID", async (req, res) => {
	const success = await database.updateItem(req.body);
	wsConnections.forEach((conn) => {
		conn.send(
			JSON.stringify({
				action: "updateItem",
				item: req.body,
			})
		);
	});
	// TODO: send back slightly more useful information
	res.sendStatus(success ? 200 : 500);
});
server.delete("/api/items/:itemID", async (req, res) => {
	const success = await database.deleteItem(Number(req.params.itemID));
	wsConnections.forEach((conn) => {
		conn.send(
			JSON.stringify({
				action: "deleteItem",
				item: { ID: Number(req.params.itemID) },
			})
		);
	});
	// TODO: send back slightly more useful information
	res.sendStatus(success ? 200 : 500);
});
server.get("/api/websocket_port", (_req, res) =>
	res.send(process.env.WS_PORT ?? "3001")
);
server.listen(process.env.WEB_PORT ?? 3000);
