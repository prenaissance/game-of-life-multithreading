import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import "webpack-dev-server";
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const isProduction = process.env.NODE_ENV === "production";
const getFileName = () => isProduction ? "[name].[contenthash]" : "[name]";

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                // options: {
                //     configFile: path.join(__dirname, "tsconfig.json")
                // },
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[name].[hash][ext][query]"
                }
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: false,
            title: "Canvas Paint",
            template: path.join(__dirname, "src", "index.html")
        }),
        new MiniCssExtractPlugin({
            filename: `assets/${getFileName()}.css`,
        })
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: `assets/${getFileName()}.js`,
        publicPath: "",
        assetModuleFilename: "assets/[name][hash][ext][query]",
        clean: true
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            assets: path.join(__dirname, "src", "assets")
        }
    },
    devServer: {
        compress: true,
        port: 5000,
        static: {
            directory: path.join(__dirname, "public")
        },
        open: true
    },
}

export default config;