import React from "react";
import { Theme } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Item } from "../../database";
import ShoppingListEditModal from "./ShoppingListEditModal";
import ShoppingListFooter from "./ShoppingListFooter";
import ShoppingListTable from "./ShoppingListTable";

export const ShoppingList = ({
	onToggleTheme,
	theme,
}: {
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
			.then((res) => res.json())
			.then((items) => setItems(items));
	}, []);

	const clearItems = () => {
		items
			.filter((item) => item.Obtained)
			.forEach((item) =>
				window.fetch(`/api/items/${item.ID}`, { method: "delete" })
			);
		// TODO: replace this local update with update over websockets
		setItems(items.filter((item) => !item.Obtained));
	};

	const editItem = (item: Item, buttonCaption: string) => {
		setSelectedItem(item);
		setEditorButtonCaption(buttonCaption);
		setEditorOpen(true);
	};

	const editorModalSubmit = (itemName: string) => {
		window.fetch("/api/items", {
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
		});
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

	const deleteItem = (item: Item) => {
		window.fetch(`/api/items/${item.ID}`, { method: "delete" });
		// TODO: replace this local update with update over websockets
		setItems(items.filter((oldItem) => item.ID !== oldItem.ID));
	};

	return (
		<React.Fragment>
			<Typography variant="h4" sx={{ margin: "1rem", textAlign: "center" }}>
				Shopping List
			</Typography>
			<Divider />
			<ShoppingListTable
				items={items}
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
