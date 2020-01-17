/**
 * webpack
 * @author Xiaolong
 */
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const webpackConfigBase = require('./webpack.config.base.js');
const config = require('./config');

const devConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                autoprefixer(),
                pxtorem({
                  rootValue: 100,
                  propWhiteList: ['*'],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    port: config.DEV_PORT,
    host: config.DEV_IP,
    hot: true,
    quiet: false,
    contentBase: './source',
    disableHostCheck: true,
    historyApiFallback: {
      index: '/index.html',
    },
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
    proxy: {},
    open: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('development'),
      __VERSION__: JSON.stringify('0'),
    }),
  ],
};
module.exports = merge(webpackConfigBase, devConfig);
