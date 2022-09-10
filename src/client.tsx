import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
					<ShoppingList onToggleTheme={toggleTheme} theme={theme} />
				</Paper>
			</Box>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")).render(<App />);
