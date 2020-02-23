const path = require("path");
const glob = require('glob')
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
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({}),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ]
};
