const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const PATHS = {
  src: path.join(process.cwd(), 'src'),
  dist: path.resolve(process.cwd(), 'dist')
}

module.exports = {
  mode: 'production',
  output: {
    path: PATHS.dist
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/mobius.css'
    }),
    new PurgecssPlugin({
      verbose: true,
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      // Problem: "At the moment purgecss only works with basic selectors like id, class and tag because of limitations in the extractors."
      // Refer to: https://github.com/FullHuman/purgecss/issues/110
      // Solution: Use comment approach to whitelist attribute selectors
      // whitelistPatterns: [/[a-zA-Z]+\[.+?\]/],
      // whitelistPatternsChildren: [/[a-zA-Z]+\[.+?\]/],
      rejected: true
    }),
    new OptimizeCssAssetsWebpackPlugin({})
  ],
  devtool: 'hidden-nosources-source-map'
}
