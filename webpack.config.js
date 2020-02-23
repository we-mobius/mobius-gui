
const commonConfig = require("./config/webpack.common");
const developmentConfig = require("./config/webpack.dev");
const productionConfig = require("./config/webpack.prod");
const merge = require("webpack-merge");

module.exports = (env, args) => {
  let { mode } = args;

  let specificConfig = mode === "production" ? productionConfig : developmentConfig;

  return merge(commonConfig, specificConfig, {});
}
