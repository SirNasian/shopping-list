import React from "react";
import { Theme } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Item } from "../../database";
import ShoppingListEditModal from "./ShoppingListEditModal";
import ShoppingListFooter from "./ShoppingListFooter";
import ShoppingListTable from "./ShoppingListTable";
import WebSocketMessage from "../../interfaces/WebSocketMessage";

export const ShoppingList = ({
	onError,
	onToggleTheme,
	theme,
}: {
	onError: (msg: string) => void;
	onToggleTheme: () => void;
	theme: Theme;
}): JSX.Element => {
	const [connected, setConnected] = React.useState<boolean>(false);
	const [editorButtonCaption, setEditorButtonCaption] =
		React.useState<string>("");
	const [editorOpen, setEditorOpen] = React.useState<boolean>(false);
	const [selectedItem, setSelectedItem] = React.useState<Item>(undefined);

	const ws = React.useRef<WebSocket>(null);

	const [items, updateItems] = React.useReducer(
		(items: Item[], msg: WebSocketMessage) => {
			items = items ?? [];
			switch (msg.action) {
				case "createItem":
					return [...items, msg.item];
				case "deleteItem":
					return items.filter((item) => item.ID !== msg.item.ID);
				case "updateItem":
					return items.map((item) =>
						item.ID === msg.item.ID
							? {
									...item,
									Name: msg.item?.Name ?? item.Name,
									Obtained: msg.item?.Obtained ?? item.Obtained,
							  }
							: item
					);
				default:
					return items;
			}
		},
		undefined
	);

	React.useEffect(() => {
		window
			.fetch("/api/items")
			.then<Item[]>((res) => {
				if (res.status !== 200) throw new Error("Failed to load items");
				return res.json();
			})
			.then((items) =>
				items.length > 0
					? items.forEach((item) =>
							updateItems({ action: "createItem", item: item })
					  )
					: updateItems({ action: undefined, item: undefined })
			)
			.catch((error) => onError(error.message));
		window.fetch("/api/websocket_port").then(async (res) => {
			ws.current = new WebSocket(
				`ws://${window.location.hostname}:${await res.text()}`
			);
			ws.current.onmessage = (event: { data: string }) =>
				updateItems(JSON.parse(event.data));
			ws.current.onopen = () => setConnected(true);
			ws.current.onclose = () => setConnected(false);
		});
		return () => ws.current.close();
	}, []);

	const clearItems = () => {
		items
			.filter((item) => item.Obtained)
			.forEach((item) =>
				window
					.fetch(`/api/items/${item.ID}`, { method: "delete" })
					.then((res) => {
						if (res.status !== 200)
							throw new Error(`Failed to delete item "${item.Name}"`);
					})
					.catch((error) => onError(error.message))
			);
	};

	const checkItem = (item: Item, checked: boolean) => {
		window
			.fetch(`/api/items/${item.ID}`, {
				method: "put",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ID: item.ID,
					Obtained: checked,
				}),
			})
			.then((res) => {
				if (res.status !== 200)
					throw new Error(`Failed to update item "${item.Name}"`);
			})
			.catch((error) => onError(error.message));
	};

	const deleteItem = (item: Item) => {
		window
			.fetch(`/api/items/${item.ID}`, { method: "delete" })
			.then((res) => {
				if (res.status !== 200)
					throw new Error(`Failed to delete item "${item.Name}"`);
			})
			.catch((error) => onError(error.message));
	};

	const editItem = (item: Item, buttonCaption: string) => {
		setSelectedItem(item);
		setEditorButtonCaption(buttonCaption);
		setEditorOpen(true);
	};

	const editorModalSubmit = (itemName: string) => {
		window
			.fetch(`/api/items/${selectedItem?.ID ?? -1}`, {
				method: "put",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ID: selectedItem?.ID ?? -1,
					Name: itemName,
				}),
			})
			.then((res) => {
				if (res.status !== 200)
					throw new Error(
						`Failed to ${selectedItem ? "update" : "create"} item "${
							selectedItem?.Name ?? itemName
						}"`
					);
			});
		setEditorOpen(false);
	};

	return connected ? (
		<React.Fragment>
			<Typography variant="h4" sx={{ margin: "1rem", textAlign: "center" }}>
				Shopping List
			</Typography>
			<Divider />
			<ShoppingListTable
				items={items}
				onCheck={checkItem}
				onEdit={(item) => editItem(item, "Update")}
				onDelete={deleteItem}
			/>
			<Divider />
			<ShoppingListFooter
				onAddItem={() => editItem(undefined, "Add")}
				onClearItems={clearItems}
				onToggleTheme={onToggleTheme}
				theme={theme}
			/>
			<ShoppingListEditModal
				buttonCaption={editorButtonCaption}
				defaultText={selectedItem ? selectedItem.Name : ""}
				onClose={() => setEditorOpen(false)}
				onSubmit={editorModalSubmit}
				open={editorOpen}
			/>
		</React.Fragment>
	) : (
		<Typography variant="h4" sx={{ margin: "1rem", textAlign: "center" }}>
			Not Connected
		</Typography>
	);
};

export default ShoppingList;
