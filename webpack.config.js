const path = require('path');
const webpackDashboard = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require("webpack-notifier");

const config = {
  entry: ["./source/_assets/js", "./source/_assets/scss/screen.scss"],
  output: {
    filename: "assets/js/site.js",
    path: path.resolve(__dirname, "_site"),
    publicPath: "."
  },
  devtool: "source-map", 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
              context: './source/_assets/scss/',
              outputPath: 'assets/css',
              publicPath: '/_site/assets/css'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 2,
              sourceMap: true
            }
          },
          { loader: "postcss-loader",
            options: { sourceMap: true }
          }, 
          { loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Modules: path.resolve(__dirname, "source/_assets/js/modules/"),
      Sass: path.resolve(__dirname, "source/_assets/scss/")
    }
  },
  plugins: [
    new webpackDashboard(),
    new CopyWebpackPlugin([{ from: "source/_assets/img", to: "assets/img" }]),
    new WebpackNotifierPlugin({ alwaysNotify: true })
  ]
};

module.exports = config; 
