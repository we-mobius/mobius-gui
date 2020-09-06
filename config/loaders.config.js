const svgToMiniDataURI = require('mini-svg-data-uri')

const handlebarsLoader = {
  test: /\.(hbs|handlebars)$/i,
  use: ['handlebars-loader']
}

const imageLoader = {
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash:10].[ext]',
        outputPath: 'statics/images/'
        // 作为该资源的引用路径，可用于配置 CDN，优先于 MiniCssExtractPlugin.loader 设置的 publicPath
        // publicPath: 'https://cdn.cigaret.world/statics/images/'
      }
    }
  ]
}

const svgLoader = {
  test: /\.svg$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 5120,
        generator: (content) => svgToMiniDataURI(content.toString()),
        fallback: 'file-loader',
        name: '[name].[contenthash:10].[ext]',
        outputPath: 'statics/images/'
      }
    }
  ]
}

const fontLoader = {
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'statics/fonts/'
      }
    }
  ]
}

const fontLoader4Release = {
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10240,
        fallback: 'file-loader',
        name: '[name].[ext]',
        outputPath: 'statics/fonts/'
      }
    }
  ]
}

const jsLoader = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: [{
    loader: 'babel-loader'
  }]
}

module.exports = {
  development: [handlebarsLoader, jsLoader, imageLoader, svgLoader, fontLoader],
  production: [handlebarsLoader, jsLoader, imageLoader, svgLoader, fontLoader],
  release: [handlebarsLoader, jsLoader, imageLoader, svgLoader, fontLoader4Release]
}
