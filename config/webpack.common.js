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
    alias: {
      Libs: resolve('src/libs/'),
      MobiusJS$: resolve('src/libs/mobius-js.js'),
      Elements$: resolve('src/elements/index.js')
    },
    symlinks: false
  }
}
