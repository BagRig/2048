const common = require("./webpack.common")();
const { merge } = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = () => {
    return merge(common, {
        mode: "development",

        plugins: [
            new ForkTsCheckerWebpackPlugin({
                eslint: { enabled: true, files: "./src/**/*.{ts,js}" },
                typescript: {
                    diagnosticOptions: {
                        semantic: true,
                        syntactic: true,
                    },
                },
            }),
        ],
    });
};
