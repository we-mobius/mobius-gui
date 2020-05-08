const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const PATHS = {
  output: path.resolve(process.cwd(), 'build')
}

module.exports = {
  mode: 'development',
  output: {
    path: PATHS.output
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    // CopyPlugin configurations: https://github.com/webpack-contrib/copy-webpack-plugin
    new CopyPlugin([
      {
        from: './src/statics/favicons/',
        // to 可以写相对 webpack.config.output.path 的路径，比如 './statics/favicons/'
        // 但 CopyPlugin 插件的文档中没有明确说明 to 最终路径的计算规则
        // 所以我个人推荐手动计算绝对路径，如下
        to: path.resolve(PATHS.output, './statics/favicons/'),
        toType: 'dir'
      }
    ])
  ],
  devtool: 'eval-source-map',
  devServer: {
    writeToDisk: true,
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }
}
