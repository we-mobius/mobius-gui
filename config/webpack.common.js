const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    filename: "[name].js"
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
