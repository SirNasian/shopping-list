import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { Item } from "../database";

export const ShoppingList = (): JSX.Element => {
	const [items, setItems] = React.useState<Item[]>(undefined);

	React.useEffect(() => {
		window
			.fetch("/api/items")
			.then((res) => res.json())
			.then((items) => setItems(items));
	}, []);

	if (!items)
		return (
			<Box sx={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
				<CircularProgress />
			</Box>
		);

	return (
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
	);
};

export default ShoppingList;
