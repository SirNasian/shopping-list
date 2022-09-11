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

import { Item } from "../../database";

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

export default ShoppingListTable;
