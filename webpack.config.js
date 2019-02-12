const path = require('path');
const webpackDashboard = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require("webpack-notifier");


// Environment settings
// --------------------
//
const envSettings = {
  "rootDir": 'build/', // Where all the compiled sites go
  "assetsJSRoot": "./source/_assets/js/",
  "assetsCSSRoot": "./source/_assets/scss/",
  "assetsImgRoot": "./source/_assets/img/"
}

// Site settings
// -------------
// You can configure 1 or multiple sites here. Just add a new entry to the array, filling in the details for each site
// This is to allow multiple sites to be generated in different directories, using a single set of source asset files.
//
const sitesData = [
  {
    "name": 'Default',
    "siteRoot": '', // single site going into the root directory so set the name to an empty string
    "cssEntry": 'screen.scss',
    "jsEntry": 'index.js'
  },
];

/**
 * Loops through array of site in config array and generates a webpack configuration for each one,
 * then returns these as an array for this module to export
 *
 * @returns
 */
function createSiteConfigs(sites) {
  let siteConfigs = [];

  sites.forEach(function (site, index) {
    siteConfigs.push(createConfig(site));
  })

  return siteConfigs;
}

/**
 * Returns a webpack configuration object 
 *
 * @param {object} config - Site data object
 * @returns {object} webpack configuration object
 */
function createConfig(siteConfig) {
  
  return { 
    entry: {
      site: [
        envSettings.assetsJSRoot + siteConfig.jsEntry,
        envSettings.assetsCSSRoot  + siteConfig.cssEntry,
      ]
    },
    output: {
      filename: "assets/js/[name].js",
      path: path.resolve(__dirname, envSettings.rootDir + siteConfig.siteRoot),
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
                context: envSettings.assetsCSSRoot,
                outputPath: 'assets/css',
                publicPath: envSettings.rootDir + 'assets/css' // Needs set in variant config
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
            {
              loader: "postcss-loader",
              options: { sourceMap: true }
            },
            {
              loader: "sass-loader",
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
      new CopyWebpackPlugin([{ from: envSettings.assetsImgRoot, to: "assets/img" }]),
      new WebpackNotifierPlugin({ alwaysNotify: true })
    ]
  };
}


module.exports = createSiteConfigs(sitesData);
