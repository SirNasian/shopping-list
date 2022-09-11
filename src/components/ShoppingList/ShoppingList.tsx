import React from "react";
import { Theme } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Item } from "../../database";
import ShoppingListEditModal from "./ShoppingListEditModal";
import ShoppingListFooter from "./ShoppingListFooter";
import ShoppingListTable from "./ShoppingListTable";

export const ShoppingList = ({
	onError,
	onToggleTheme,
	theme,
}: {
	onError: (msg: string) => void;
	onToggleTheme: () => void;
	theme: Theme;
}): JSX.Element => {
	const [editorButtonCaption, setEditorButtonCaption] =
		React.useState<string>("");
	const [editorOpen, setEditorOpen] = React.useState<boolean>(false);
	const [items, setItems] = React.useState<Item[]>(undefined);
	const [selectedItem, setSelectedItem] = React.useState<Item>(undefined);

	React.useEffect(() => {
		window
			.fetch("/api/items")
			.then((res) => {
				if (res.status !== 200) throw new Error("Failed to load items");
				return res.json();
			})
			.then((items) => setItems(items))
			.catch((error) => onError(error.message));
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
		// TODO: replace this local update with update over websockets
		setItems(items.filter((item) => !item.Obtained));
	};

	const checkItem = (item: Item, checked: boolean) => {
		window
			.fetch("/api/items", {
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify([
					{
						ID: item.ID,
						Obtained: checked,
					},
				]),
			})
			.then((res) => {
				if (res.status !== 200) throw new Error(`Failed to update item "${item.Name}"`);
			})
			.catch((error) => onError(error.message));
		// TODO: replace this local update with update over websockets
		setItems(
			items.map((oldItem) =>
				oldItem.ID === item.ID ? { ...oldItem, Obtained: checked } : oldItem
			)
		);
	};

	const deleteItem = (item: Item) => {
		window
			.fetch(`/api/items/${item.ID}`, { method: "delete" })
			.then((res) => {
				if (res.status !== 200) throw new Error(`Failed to delete item "${item.Name}"`);
			})
			.catch((error) => onError(error.message));
		// TODO: replace this local update with update over websockets
		setItems(items.filter((oldItem) => oldItem.ID !== item.ID));
	};

	const editItem = (item: Item, buttonCaption: string) => {
		setSelectedItem(item);
		setEditorButtonCaption(buttonCaption);
		setEditorOpen(true);
	};

	const editorModalSubmit = (itemName: string) => {
		window
			.fetch("/api/items", {
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify([
					{
						ID: selectedItem ? selectedItem.ID : -1,
						Name: itemName,
					},
				]),
			})
			.then((res) => {
				if (res.status !== 200)
					throw new Error(`Failed to ${selectedItem ? "update" : "create"} item "${
						selectedItem?.Name ?? itemName
					}"`);
			})
			.catch((error) => onError(error.message));
		// TODO: replace this local update with update over websockets
		setItems(
			selectedItem
				? [...items].map((item) => ({
						...item,
						Name: item === selectedItem ? itemName : item.Name,
				  }))
				: [
						...items,
						{
							ID:
								items.reduce((id, item) => (item.ID > id ? item.ID : id), 0) +
								1,
							Name: itemName,
							Obtained: false,
						},
				  ]
		);
		setEditorOpen(false);
	};

	return (
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
	);
};

export default ShoppingList;
