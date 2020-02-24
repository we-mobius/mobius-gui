const path = require("path");
const glob = require('glob')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(process.cwd(), 'src'),
  dist: path.resolve(process.cwd(), "dist")
}

module.exports = {
  mode: "production",
  output: {
    path: PATHS.dist
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style/main.css"
    }),
    new OptimizeCssAssetsWebpackPlugin({}),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
  devtool: "hidden-nosources-source-map"
};
