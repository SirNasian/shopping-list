import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ShoppingList from "./components/ShoppingList";

const App = () => {
	const [theme, setTheme] = React.useState<Theme>(
		createTheme({ palette: { mode: "dark" } })
	);

	const toggleTheme = () => {
		setTheme(
			createTheme({
				palette: {
					mode: theme.palette.mode === "light" ? "dark" : "light",
				},
			})
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					alignItems: "center",
					background: theme.palette.background.default,
					display: "flex",
					height: "100%",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<Paper
					sx={{
						display: "flex",
						flexDirection: "column",
						maxHeight: "100%",
						maxWidth: "100%",
					}}
				>
					<Typography variant="h4" sx={{ margin: "1rem", textAlign: "center" }}>
						Shopping List
					</Typography>
					<Divider />
					<Box sx={{ overflowY: "scroll" }}>
						<ShoppingList />
					</Box>
					<Divider />
					<Box sx={{ padding: "0.5rem" }}>
						<IconButton onClick={toggleTheme}>
							{theme.palette.mode === "light" ? (
								<LightModeIcon />
							) : (
								<DarkModeIcon />
							)}
						</IconButton>
					</Box>
				</Paper>
			</Box>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")).render(<App />);
