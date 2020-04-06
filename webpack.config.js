
const commonConfig = require('./config/webpack.common')
const developmentConfig = require('./config/webpack.dev')
const productionConfig = require('./config/webpack.prod')
const merge = require('webpack-merge')

module.exports = (env, args) => {
  const { mode } = args

  const specificConfig = mode === 'production' ? productionConfig : developmentConfig

  return merge(commonConfig, specificConfig, {})
}
