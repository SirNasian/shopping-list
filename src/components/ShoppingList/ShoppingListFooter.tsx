import React from "react";
import { Theme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

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

export default ShoppingListFooter;
