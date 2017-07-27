var webpack = require("webpack");
var path = require("path");
module.exports = {
  entry: {
    /*'webpack-dev-server/client?http://0.0.0.0:80',
     config.paths.demo*/
    app: ["./blackjack.js"]
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 80
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  }
};
