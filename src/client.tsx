import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";

import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";

import ShoppingList from "./components/ShoppingList";

interface ToastState {
	open: boolean;
	duration: number;
	severity: AlertColor;
	message: string;
}

const App = () => {
	const [toastState, setToastState] = React.useState<ToastState>({
		open: false,
		duration: 0,
		severity: "success",
		message: "",
	});
	const [theme, setTheme] = React.useState<Theme>(
		createTheme({ palette: { mode: "dark" } })
	);

	const displayErrorToast = (message: string, duration = 3000): void => {
		setToastState({
			open: true,
			duration: duration,
			severity: "error",
			message: message,
		});
	};

	const displaySuccessToast = (message: string, duration = 3000): void => {
		setToastState({
			open: true,
			duration: duration,
			severity: "success",
			message: message,
		});
	};

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
					<ShoppingList
						onError={(msg) => displayErrorToast(msg)}
						onSuccess={(msg) => displaySuccessToast(msg)}
						onToggleTheme={toggleTheme}
						theme={theme}
					/>
				</Paper>
			</Box>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				autoHideDuration={toastState.duration}
				onClose={() => setToastState({ ...toastState, open: false })}
				open={toastState.open}
			>
				<Alert severity={toastState.severity}>{toastState.message}</Alert>
			</Snackbar>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")).render(<App />);
