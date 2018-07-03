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
