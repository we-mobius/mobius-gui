import { rootResolvePath } from '../scripts/utils.js'

export const getCommonConfig = () => ({
  output: {
    filename: '[name].js',
    publicPath: './'
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
      FreeBusiness: rootResolvePath('src/business-free/'),
      Statics: rootResolvePath('src/statics/'),
      Images: rootResolvePath('src/statics/images/'),
      Styles: rootResolvePath('src/statics/styles/'),
      // NOTE: pack alone
      'lit-html': rootResolvePath('node_modules/lit-html/')
    },
    symlinks: false
  }
})
