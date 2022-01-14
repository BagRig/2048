const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// prettier-ignore
const PATHS = {
    html:    path.resolve("html", "index.hbs"),
    index: path.resolve("src", "index.ts"),
    dist:    path.resolve("dist"),
};

module.exports = () => {
    return {
        entry: {
            app: {
                import: [PATHS.index],
                dependOn: "modules",
            },
            modules: ["pixi.js"],
        },

        output: {
            publicPath: "",
            path: PATHS.dist,
            filename: "[name].[contenthash].js",
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: "Learn",
                template: PATHS.html,
            }),
            new CopyPlugin({
                patterns: [{ from: path.resolve("assets"), to: path.resolve("dist/assets") }],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    use: [
                        {
                            loader: "handlebars-loader",
                        },
                    ],
                },
                {
                    // Include ts, tsx, js, and jsx files.
                    test: /\.(ts|js)x?$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-typescript"],
                        },
                    },
                },
            ],
        },
    };
};
