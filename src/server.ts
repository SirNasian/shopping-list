import express from "express";
import database from "./database";

database.setup();

const server = express();
server.use(express.static("public"));
server.listen(process.env.WEB_PORT ?? "3000");
