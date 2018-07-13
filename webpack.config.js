const path = require("path");

module.exports = {
    entry: "./ui/index.js",
    output: {
        path: path.resolve(__dirname, "public", "js"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" }
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: "graphql-tag/loader"
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]_[local]_[hash:base64]",
                            sourceMap: false,
                            minimize: true
                        }
                    }
                ],
                include: path.resolve(__dirname, "./ui")
            }
        ]
    }
};
