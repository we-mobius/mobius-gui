const path = require('path')
const resolve = dir => path.resolve(__dirname, '../', dir)

module.exports = {
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: []
  },
  plugins: [],
  resolve: {
    extensions: ['.js'],
    alias: {},
    symlinks: false
  }
}
