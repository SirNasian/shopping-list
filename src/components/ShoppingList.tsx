import React from "react";
import { Theme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LightModeIcon from "@mui/icons-material/LightMode";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Item } from "../database";

export const ShoppingListTable = ({
	items,
	onDelete,
	onEdit,
}: {
	items: Item[];
	onDelete: (item: Item) => void;
	onEdit: (item: Item) => void;
}): JSX.Element =>
	items ? (
		<TableContainer>
			<Table size="small">
				<TableBody>
					{items.map((item) => (
						<TableRow key={item.ID}>
							<TableCell>
								<Checkbox checked={Boolean(item.Obtained)} />
							</TableCell>
							<TableCell>
								<Box
									sx={{
										textDecoration: item.Obtained ? "line-through" : "auto",
									}}
								>
									{item.Name}
								</Box>
							</TableCell>
							<TableCell>
								<IconButton onClick={() => onEdit(item)}>
									<EditIcon />
								</IconButton>
							</TableCell>
							<TableCell>
								<IconButton onClick={() => onDelete(item)}>
									<DeleteIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	) : (
		<Box sx={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
			<CircularProgress />
		</Box>
	);

export const ShoppingListFooter = ({
	onAddItem,
	onClearItems,
	onToggleTheme,
	theme,
}: {
	onAddItem: () => void;
	onClearItems: () => void;
	onToggleTheme: () => void;
	theme: Theme;
}): JSX.Element => (
	<Box
		sx={{
			display: "flex",
			justifyContent: "space-between",
			padding: "0.5rem",
		}}
	>
		<IconButton onClick={onToggleTheme}>
			{theme.palette.mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
		</IconButton>
		<Box>
			<IconButton onClick={onAddItem}>
				<AddIcon />
			</IconButton>
			<IconButton onClick={onClearItems}>
				<ClearAllIcon />
			</IconButton>
		</Box>
	</Box>
);

const ShoppingListEditModal = ({
	buttonCaption,
	defaultText,
	onClose,
	onSubmit,
	open,
}: {
	buttonCaption: string;
	defaultText: string;
	onClose: () => void;
	onSubmit: (text: string) => void;
	open: boolean;
}) => {
	const [text, setText] = React.useState<string>(defaultText);

	const submit = (): void => {
		onSubmit(text);
		setText("");
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={{ top: "auto", position: "absolute" }}
		>
			<Paper sx={{ display: "flex", padding: "0.5rem" }}>
				<TextField
					autoFocus
					fullWidth
					onChange={(event) => setText(event.target.value)}
					onKeyUp={(event) =>
						event.key === "Enter" && text.trim() !== "" && submit()
					}
					size="small"
					value={text}
					variant="outlined"
				/>
				<Button disabled={text.trim() === ""} onClick={() => submit()}>
					{buttonCaption}
				</Button>
			</Paper>
		</Modal>
	);
};

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
		// TODO: implement this
		console.log("TODO: clearItems");
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
		console.log(itemName);
		setEditorOpen(false);
	};

	const deleteItem = (item: Item) => {
		// TODO: implement this
		console.log(item);
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
