import { getCommonConfig } from './config/webpack.common.js'
import { getDevelopmentConfig } from './config/webpack.dev.js'
import { getBuildConfig } from './config/webpack.build.js'
import { getProductionConfig } from './config/webpack.prod.js'
import { getReleaseConfig } from './config/webpack.release.js'
import { merge } from 'webpack-merge'

export const getWebpackConfig = (env, args) => {
  const { mode } = env
  const commonConfig = getCommonConfig()
  let specificConfig = null
  switch (mode) {
    case 'production':
      specificConfig = getProductionConfig()
      break
    case 'development':
      specificConfig = getDevelopmentConfig()
      break
    case 'build':
      specificConfig = getBuildConfig()
      break
    case 'release':
      specificConfig = getReleaseConfig()
      break
    default:
      break
  }
  return merge(commonConfig, specificConfig, {})
}
