const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const mobiusConfig = require('./mobius.config')

// All files inside webpack's output.path directory will be removed once, but the
// directory itself will not be. If using webpack 4+'s default configuration,
// everything under <PROJECT_DIR>/dist/ will be removed.
// Use cleanOnceBeforeBuildPatterns to override this behavior.
//
// clean-webpack-plugin configurations: https://github.com/johnagan/clean-webpack-plugin
const commonClean = new CleanWebpackPlugin({
  dry: false,
  verbose: true,
  cleanOnceBeforeBuildPatterns: ['**/*']
})

// html-webpack-plugin configurations: https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
const commonHtmlPackBeforeRelease = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './src/statics/templates/index.hbs',
  templateParameters: (compilation, assets, assetTags, options) => {
    return {
      webpackConfig: compilation.options,
      htmlWebpackPlugin: {
        options,
        tags: assetTags,
        files: assets,
        css: assets.css, // .reverse(), // NOTE: sort matters
        js: assets.js
      },
      mobiusConfig: mobiusConfig.template.index
    }
  },
  // scriptLoading 的更改会自动应用到 assetTags.headTags 和 assertTags.bodyTags 的分配中
  // 如果 inject 未设置，也会影响 inject 的值： defer → head, blocking → body
  scriptLoading: 'defer',
  // inject 为 false 时，assetTags.headTags 和 assertTags.bodyTags 需要手动分配
  inject: false,
  // 不显式设置 minify: true 的时候会自动按照 mode 切换： production → true
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  }
})

module.exports = {
  development: [commonClean, commonHtmlPackBeforeRelease],
  production: [commonClean, commonHtmlPackBeforeRelease],
  release: [commonClean]
}
