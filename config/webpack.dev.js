const path = require("path");

const PATHS = {
  build: path.resolve(process.cwd(), "build")
}

module.exports = {
  mode: "development",
  output: {
    path: PATHS.build
  },
  devServer: {
    contentBase: "./build",
    port: 3000,
    open: true,
    hot: true
  }
};
