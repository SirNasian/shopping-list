const path = require("path");
module.exports = [
	{
		target: "web",
		entry: "./src/client.tsx",
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
		},
		output: {
			filename: "client.js",
			path: path.resolve(__dirname, "public/js"),
		},
	},
	{
		target: "node",
		entry: "./src/server.ts",
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		output: {
			filename: "server.js",
			path: path.resolve(__dirname, "dist"),
		},
	}
];
