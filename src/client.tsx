import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

const App = () => {
	const [theme, setTheme] = React.useState<Theme>(
		createTheme({ palette: { mode: "light" } })
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
				}}
			>
				<Paper>
					<Box sx={{ margin: "12rem" }}>
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
