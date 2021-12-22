import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { getMobiusConfig } from './mobius.config.js'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

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

const forkTsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin({
  typescript: {
    syntactic: true, semantic: true, declaration: false, global: false
  }
})

const htmlWebpackPluginFactory = ({ pageName = 'index', templateName, keywords = [] }) => {
  templateName = templateName || pageName

  // html-webpack-plugin configurations: https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
  return new HtmlWebpackPlugin({
    filename: `${pageName}.html`,
    template: `./src/statics/templates/${templateName}.hbs`,
    templateParameters: (compilation, assets, assetTags, options) => {
      console.log('【HtmlWebpackPlugin】 build template: ', pageName)
      console.log('【HtmlWebpackPlugin】 assets.js raw:', assets.js)
      console.log('【HtmlWebpackPlugin】 assets.js filtered:', assets.js.filter(file => keywords.some(keyword => file.indexOf(keyword) > -1)))
      return {
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          options,
          tags: assetTags,
          files: assets,
          css: assets.css, // .reverse(), // NOTE: sort matters
          js: assets.js.filter(file => keywords.some(keyword => file.indexOf(keyword) > -1))
        },
        mobiusConfig: getMobiusConfig().template[pageName]
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
}

const indexHtmlPack = htmlWebpackPluginFactory({
  pageName: 'index',
  templateName: 'index',
  keywords: ['index', 'static']
})

const bundleAnalyzer = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false
})

export const getDevelopmentPlugins = () => [forkTsCheckerWebpackPlugin, indexHtmlPack]
export const getBuildPlugins = () => [forkTsCheckerWebpackPlugin, indexHtmlPack]
export const getProductionPlugins = () => [forkTsCheckerWebpackPlugin, indexHtmlPack, bundleAnalyzer]
export const getReleasePlugins = () => [forkTsCheckerWebpackPlugin]
