const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/entry/app.js",
    style: "./src/entry/style.js"
  },
  output: {
    filename: "./entry/[name].js"
  },
  module: {
    rules: []
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ["**/*"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
