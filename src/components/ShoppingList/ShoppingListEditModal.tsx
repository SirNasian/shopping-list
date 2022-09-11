import React from "react";

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

export const ShoppingListEditModal = ({
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

export default ShoppingListEditModal;
