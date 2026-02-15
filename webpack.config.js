const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/js/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "bundle.[contenthash].js" : "bundle.js",
      clean: true,
    },
    devtool: isProd ? false : "source-map",
    devServer: {
      static: "./dist",
      open: true,
      port: 3000,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "style.[contenthash].css" })]
        : []),
    ],
  };
};
