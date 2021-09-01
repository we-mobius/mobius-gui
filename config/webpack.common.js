import { rootResolvePath } from '../scripts/utils.js'
import { getMobiusConfig } from './mobius.config.js'

export const getCommonConfig = () => ({
  output: {
    filename: '[name].js',
    publicPath: getMobiusConfig().publicPath
  },
  module: {
    rules: []
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      ES: rootResolvePath('src/es/'),
      ES$: rootResolvePath('src/es/index.js'),
      CJS: rootResolvePath('src/cjs/'),
      CJS$: rootResolvePath('src/cjs/index.cjs'),
      TS: rootResolvePath('src/ts/'),
      TS$: rootResolvePath('src/ts/index.ts'),
      Libs: rootResolvePath('src/ts/libs/'),
      MobiusUtils$: rootResolvePath('src/ts/libs/mobius-utils.ts'),
      MobiusUI$: rootResolvePath('src/ts/libs/mobius-ui.ts'),
      MobiusJS$: rootResolvePath('src/ts/libs/mobius-js.ts'),
      Interface: rootResolvePath('src/ts/interface/'),
      Business: rootResolvePath('src/ts/business/'),
      FreeBusiness: rootResolvePath('src/ts/business-free/'),
      Statics: rootResolvePath('src/statics/'),
      Images: rootResolvePath('src/statics/images/'),
      Styles: rootResolvePath('src/statics/styles/'),
      // NOTE: pack alone
      'lit-html': rootResolvePath('node_modules/lit-html/')
    },
    symlinks: false
  }
})
