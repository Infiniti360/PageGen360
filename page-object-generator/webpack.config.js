const path = require('path');

module.exports = {
  entry: {
    "content-script": "./content-script.ts",
    "background": "./background.ts",
    "generator": "./generator.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  mode: "development",
  // Exclude test files from build
  externals: {
    'cy': 'cy'
  }
};
