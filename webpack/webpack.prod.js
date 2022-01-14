const common = require("./webpack.common")();
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = () => {
    return merge(common, {
        mode: "production",

        plugins: [
            //
            new webpack.CleanPlugin(),
            new WebpackManifestPlugin(),
        ],

        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
    });
};
