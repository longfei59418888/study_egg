/**
 * webpack
 * @author Xiaolong
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackPluginCrossorigin = require('html-webpack-plugin-crossorigin');
const webpackConfigBase = require('./webpack.config.base.js');
const AfterBuild = require('./afterBuild');

const timestamp = new Date().getTime();
const outputName = `output_${timestamp}.zip`;
const { NODE_ENV = 'development' } = process.env;

const prodConfig = {
  mode: 'production',
  entry: ['./src/app.js'],
  output: {
    publicPath: './',
    filename: 'js/[name]_pro.js',
    chunkFilename: 'js/[name]_pro.js',
    path: path.resolve(__dirname, '../source'),
    crossOriginLoading: 'anonymous',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
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
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  optimization: {
    namedChunks: true,
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-.*|redux|classnames|es6-promise|isomorphic-fetch|core-js)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 5,
        },
        // 将异步，大于30K，引用次数三次以上的，打包到一个
        // commons: {
        //   chunks: 'async',
        //   name: 'commons-async',
        //   minSize: 30000,
        //   priority: 20,
        //   minChunks: 3,
        // },
        antd: {
          test: /[\\/]node_modules[\\/](antd.*)[\\/]/,
          name: 'ant',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_pro.css',
      chunkFilename: 'css/[id]_pro.css',
    }),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(NODE_ENV),
      __VERSION__: JSON.stringify(timestamp),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      attributes: {
        crossorigin: 'anonymous',
      },
      debug: NODE_ENV !== 'production' && NODE_ENV !== 'UAT',
    }),
    new HtmlWebpackPluginCrossorigin({
      inject: true,
    }),
    new FileManagerPlugin({
      onEnd: {
        delete: ['./output'],
        mkdir: ['./output'],
        archive: [
          {
            source: './source',
            destination: `./output/${outputName}`,
          },
        ],
      },
    }),
    new AfterBuild({
      __VERSION__: timestamp,
      IS_SAVE: NODE_ENV === 'production',
    }),
  ],
};


module.exports = merge(webpackConfigBase, prodConfig);
