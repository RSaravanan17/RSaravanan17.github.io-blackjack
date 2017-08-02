var webpack = require("webpack");
var path = require("path");
module.exports = {
  entry: {
    app: ["./blackjack.js"]
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 3000
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  }
};
