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
    extensions: ['.js', '.ts', '...'],
    alias: {
      Libs: rootResolvePath('src/ts/libs/'),
      MobiusUtils$: rootResolvePath('src/ts/libs/mobius-utils.ts'),
      MobiusGUI$: rootResolvePath('src/ts/libs/mobius-gui.ts'),
      MobiusServices$: rootResolvePath('src/ts/libs/mobius-services.ts'),
      Interfaces: rootResolvePath('src/ts/interfaces/'),
      Services: rootResolvePath('src/ts/services/'),
      FreeServices: rootResolvePath('src/ts/services-free/'),
      Statics: rootResolvePath('src/statics/'),
      Images: rootResolvePath('src/statics/images/'),
      Styles: rootResolvePath('src/statics/styles/'),

      ES: rootResolvePath('src/es/'),
      ES$: rootResolvePath('src/es/index.js'),
      CJS: rootResolvePath('src/cjs/'),
      CJS$: rootResolvePath('src/cjs/index.cjs'),
      TS: rootResolvePath('src/ts/'),
      TS$: rootResolvePath('src/ts/index.ts'),

      // NOTE: pack alone
      'lit-html': rootResolvePath('node_modules/lit-html/')
    },
    symlinks: false
  }
})
