/*
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
*/

const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
	entry: {
		main: './src/main.js'
	},
	output: {
	  path:	path.resolve(__dirname, 'dist'),
	  filename: 'main.js',
	},
	mode: isDevelopment ? 'development' : 'production',
	devtool: isDevelopment && "source-map",
	devServer: {
		historyApiFallback: true,
		port: 3000,
		open: true
	},
	resolve: {
		extensions: ['.js', '.json'],
	},

	optimization: isDevelopment ? undefined : {
		minimize: true,
		/*minimizer: [
			new UglifyJsPlugin({
				exclude: 'sw.js',
				uglifyOptions: {
					output: {
						comments: false
					},
					ie8: false,
					toplevel: true
				}
			})
		],*/
	},

	module: {
		rules: [
			{        
				test: /\.js$/,     
				exclude: /node_modules/,        
				loader: "babel-loader"
			},
			{        
			    test: /\.css$/,        
			    use: [
			    	'style-loader', 
			    	'css-loader',
			    	{
						loader: "postcss-loader",
						options: {
							autoprefixer: {
								browsers: 'last 2 versions, > 1%'
							},
							sourceMap: isDevelopment,
							plugins: () => [
								autoprefixer
							]
						},
					},
			    ] //orde is important
			},
			{
				test: /\.(jpe?g|png|gif|svg|ttf)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							attrs: ['img:src','link:href','image:xlink:href'],
							name: '[name].[ext]',
							outputPath: 'static/',
							useRelativePath: true,
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 80
							},
							optipng: {
								enabled: true,
							},
							pngquant: {
								quality: '80-90',
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							},
							/*webp: {
								quality: 75
							}*/
						}
					}
				]
			},
		],
	},

	plugins: [
		/*new webpack.DefinePlugin({
			_GLOBALS_: JSON.stringify({
				update_time: Date.now()
			})
		}),*/
		/*new MiniCssExtractPlugin({
			filename: "[name]-styles.css",
			chunkFilename: "[id].css"
		}),*/
		new HtmlWebpackPlugin({
			hash: isDevelopment,
			favicon: isDevelopment ? './src/img/favicon.png' : undefined,
			title: 'Domino Sandbox',
			minify: !isDevelopment,
			template: './src/index.html',
			filename: './index.html',
			//inject: 'head',
		}),
	]
};
