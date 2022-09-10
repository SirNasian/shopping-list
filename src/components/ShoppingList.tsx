import React from "react";
import { Theme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LightModeIcon from "@mui/icons-material/LightMode";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Item } from "../database";

export const ShoppingListTable = ({ items }: { items: Item[] }): JSX.Element =>
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
								<IconButton>
									<EditIcon />
								</IconButton>
							</TableCell>
							<TableCell>
								<IconButton>
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

export const ShoppingList = ({
	onToggleTheme,
	theme,
}: {
	onToggleTheme: () => void;
	theme: Theme;
}): JSX.Element => {
	const [items, setItems] = React.useState<Item[]>(undefined);

	React.useEffect(() => {
		window
			.fetch("/api/items")
			.then((res) => res.json())
			.then((items) => setItems(items));
	}, []);

	const addItem = () => {
		// TODO: implement this
		console.log("TODO: addItem");
	};

	const clearItems = () => {
		// TODO: implement this
		console.log("TODO: clearItems");
	};

	return (
		<React.Fragment>
			<Typography variant="h4" sx={{ margin: "1rem", textAlign: "center" }}>
				Shopping List
			</Typography>
			<Divider />
			<ShoppingListTable items={items} />
			<Divider />
			<ShoppingListFooter
				onAddItem={addItem}
				onClearItems={clearItems}
				onToggleTheme={onToggleTheme}
				theme={theme}
			/>
		</React.Fragment>
	);
};

export default ShoppingList;
