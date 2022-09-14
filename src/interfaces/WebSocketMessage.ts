import { Item } from "../database";

export interface WebSocketMessage {
	action: "createItem" | "deleteItem" | "updateItem";
	item: Item;
}

export default WebSocketMessage;
