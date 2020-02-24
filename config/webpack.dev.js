const path = require("path");

const PATHS = {
  build: path.resolve(process.cwd(), "build")
}

module.exports = {
  mode: "development",
  output: {
    path: PATHS.build
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./build",
    port: 3000,
    open: true,
    hot: true
  }
};
