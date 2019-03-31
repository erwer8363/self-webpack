const path = require('path')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'
const bundlePath = path.resolve(__dirname, '../dist')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

console.log('这个时候的devMode是。。。', bundlePath, process.env.NODE_ENV, path.resolve(__dirname, '../dist'))

module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/page')
        }
    },
    output: {
        publicPath: './',
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ['env', 'react'] }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {loader: "css-loader", options: { importLoaders: 1 }},
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'img/[name]-[hash:5].min.[ext]',
                            publicPath: devMode ? './' : '../',
                            path: path.resolve(__dirname, 'dist'),
                            limit: 8192
                        }
                    },
                    {
                        loader: "img-loader",
                        options: {
                            plugins: [
                                require("imagemin-pngquant")({
                                    quality: "80"
                                }),
                                require("imagemin-mozjpeg")({
                                    progressive: true,
                                    arithmetic: false
                                })
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                // cssProcessorOptions: cssnanoOptions,
                cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true,
                        },
                        normalizeUnicode: false
                    }]
                },
                canPrint: true
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            })
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 3000,
        publicPath: "http://localhost:3000/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: devMode ?  'css/[name].css' : "css/[name].[hash:5].css"
            // chunkFilename: devMode ? "[id].css" : "[id].[hash:5].css"
        }),
        new CleanWebpackPlugin()
    ]
}