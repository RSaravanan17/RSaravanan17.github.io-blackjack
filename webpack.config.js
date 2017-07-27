var webpack = require("webpack");
var path = require("path");
module.exports = {
  entry: {
    'webpack-dev-server/client?http://0.0.0.0:80',
    app: ["./blackjack.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  }
};
