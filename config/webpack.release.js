import { rootResolvePath } from '../scripts/utils.js'
import { getReleaseLoaders } from './loaders.config.js'
import { getReleasePlugins } from './plugins.config.js'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import path from 'path'

const PATHS = {
  src: rootResolvePath('src'),
  output: rootResolvePath('release')
}

export const getReleaseConfig = () => ({
  mode: 'production',
  entry: {
    mobius: './src/mobius.release.entry.js',
    addon: './src/addon.release.entry.js',
    base: './src/base.release.entry.js',
    mobiusui: './src/mobiusui.release.entry.js'
  },
  output: {
    path: PATHS.output
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 添加在 CSS 文件中引用的其它资源路径的前面，可用于配置 CDN，不如 file-loader 设置的 publicPath 优先
              // publicPath: 'https://cdn.cigaret.world/'
            }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        oneOf: [...getReleaseLoaders()]
      }
    ]
  },
  plugins: [
    ...getReleasePlugins(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css'
    }),
    // CopyPlugin configurations: https://github.com/webpack-contrib/copy-webpack-plugin
    new CopyPlugin([
      {
        from: './src/statics/favicons/',
        // to 可以写相对 webpack.config.output.path 的路径，比如 './statics/favicons/'
        // 但 CopyPlugin 插件的文档中没有明确说明 to 最终路径的计算规则
        // 所以我个人推荐手动计算绝对路径，如下
        to: path.resolve(PATHS.output, './statics/favicons/'),
        toType: 'dir'
      },
      {
        from: './src/statics/styles/fonts/',
        to: path.resolve(PATHS.output, './statics/styles/fonts/'),
        toType: 'dir'
      },
      {
        from: './src/statics/fonts/',
        to: path.resolve(PATHS.output, './statics/fonts/'),
        toType: 'dir'
      }
    ])
  ],
  devtool: 'hidden-nosources-source-map'
}
)
