import webpack from 'webpack';
import path from 'path';

module.exports = {
	context: __dirname,
	entry: {
		bundle: __dirname + '/src/js/main.js'
	},
	output: {
		path: __dirname + '/dist/js/',
		filename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			}
		]	
	},
	resolve: {
		extensions: ['', '.js', 'json']
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],
	devtool: '#inline-source-map'
};