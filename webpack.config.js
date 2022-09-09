const path = require('path');
module.exports = [
	{
		entry: './src/client.ts',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		output: {
			filename: 'client.js',
			path: path.resolve(__dirname, 'public/js'),
		},
	},
	{
		entry: './src/server.ts',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		output: {
			filename: 'server.js',
			path: path.resolve(__dirname, 'dist'),
		},
	}
];
