var webpack = require("webpack");
var path = require("path");
module.exports = {
  entry: {
    app: ["./blackjack.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  }
};
