/**
 * Created by daniel on 7/21/17.
 */

module.exports = {
    entry: {
        game: "./src/game/main.ts",
        ts_engine: "./src/lib.ts",
    },

    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with '.ts' or '.tsx' extension will be handled by 'tslint-loader'
            { test: /\.tsx?$/, enforce: 'pre', loader: 'tslint-loader', options: { } },

            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
};