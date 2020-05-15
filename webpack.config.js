
const commonConfig = require('./config/webpack.common')
const developmentConfig = require('./config/webpack.dev')
const productionConfig = require('./config/webpack.prod')
const releaseConfig = require('./config/webpack.release')
const merge = require('webpack-merge')

module.exports = (env, args) => {
  const { mode } = env

  let specificConfig = null
  switch (mode) {
    case 'production':
      specificConfig = productionConfig
      break
    case 'development':
      specificConfig = developmentConfig
      break
    case 'release':
      specificConfig = releaseConfig
      break
    default:
      break
  }
  return merge(commonConfig, specificConfig, {})
}
