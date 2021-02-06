import { rootResolvePath } from '../scripts/utils.js'

export const getCommonConfig = () => ({
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
      Libs: rootResolvePath('src/libs/'),
      MobiusUI$: rootResolvePath('src/libs/mobius-ui.js'),
      MobiusJS$: rootResolvePath('src/libs/mobius-js.js'),
      MobiusUtils$: rootResolvePath('src/libs/mobius-utils.js'),
      Interface: rootResolvePath('src/interface/'),
      Business: rootResolvePath('src/business/'),
      // NOTE: pack alone
      'lit-html': rootResolvePath('node_modules/lit-html/')
    },
    symlinks: false
  }
})
