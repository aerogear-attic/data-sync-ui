const path = require("path");

module.exports = {
    entry: "./ui/index.js",
    output: {
        path: path.resolve(__dirname, "public", "js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};

/*
const path = require("path");

module.exports = {
    entry: {
        "public/js/bundle": "./ui/ui.js",
        "dist/server": "./server/index.js"
    },
    output: {
        path: path.resolve(__dirname),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" }
            }
        ]
    },
    node: { fs: "empty", net: "empty" }
};
*/