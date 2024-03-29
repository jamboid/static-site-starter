const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require("webpack-notifier");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// What does this Webpack workflow do?
// ------------------------------------
// 
// This configuration allows you to compile sets of site assets for multiple sites, putting each set in a
// different directory. This lets multiple sites (e.g. similar microsites) using the same JS and CSS assets.
// 
// Each config does the following:
//
// 1. Compiles site JS modules into one bundle
// 2. Compiles Sass files into a single stylesheet
// 3. Copies contents of images directory to the compiled site assets folder
//
// ------------------------------------


// Environment settings
// --------------------
//
// These are the global settings that each configuration will use as the basis for putting things
// where they need to go.
//
// --------------------
const envSettings = {
  "rootDir": 'build/', // Where all the compiled sites go
  "assetsJSRoot": "./source/_assets/js/",
  "assetsCSSRoot": "./source/_assets/scss/",
  "assetsImgRoot": "./source/_assets/img/"
}

// Site settings
// -------------
//
// You can configure a single or multiple sites here. Just add a new entry to the array, filling in the details for each site
// This is to allow multiple sites to be generated in different directories, using a single set of source asset files.
//
// -------------
const sitesData = [
  {
    "name": 'Default',
    "siteRoot": '', // this single site is going into the root directory so siteRoot is set to an empty string
    "cssEntry": 'screen.scss',
    "jsEntry": 'index.js',
    "assetsDir": "/assets/"
  },
];

/**
 * Loops through array of site in config array and generates a webpack configuration for each one,
 * then returns these as an array for this module to export
 *
 * @returns {array}
 */
function createSiteConfigs(sites) {
  // The array, currently empty, that we'll be returning
  let siteConfigs = [];

  // For each individual site config in the sites object...
  // generate a webpack config object and push that to our array
  sites.forEach(function (site) {
    siteConfigs.push(createConfig(site, envSettings));
  })

  // Return the now-populated array
  return siteConfigs;
}

/**
 * Returns a webpack configuration object, using the settings in the site and environment data above
 *
 * @param {object} siteConfig - Site data object
 * @param {object} envConfig - Environment data object
 * @returns {object} webpack configuration object
 */
function createConfig(siteConfig, envConfig) {
  return { 
    entry: {
      site: [
        envConfig.assetsJSRoot + siteConfig.jsEntry,
        envConfig.assetsCSSRoot  + siteConfig.cssEntry,
      ]
    },
    output: {
      filename: "assets/js/[name].js",
      path: path.resolve(__dirname, envConfig.rootDir + siteConfig.siteRoot),
      publicPath: "."
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].css',  
                context: envConfig.assetsCSSRoot,
                outputPath: 'assets/css',
                publicPath: envConfig.rootDir + 'assets/css' // Needs set in variant config
              }
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                url: false,
                importLoaders: 2
              }
            },
            {
              loader: "postcss-loader"
            },
            {
              loader: "sass-loader"
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
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["." + siteConfig.assetsDir],
      }),
      new CopyWebpackPlugin({patterns: [{ from: envConfig.assetsImgRoot, to: "assets/img" }]}),
      new WebpackNotifierPlugin({ alwaysNotify: true }),
    ]
  };
}

module.exports = createSiteConfigs(sitesData);