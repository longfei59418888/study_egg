/**
 * webpack
 * @author Xiaolong
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const config = require('./config');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://${config.DEV_IP}:${config.DEV_PORT}`,
      'webpack/hot/only-dev-server',
      './src/app.js',
    ],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [
      path.resolve(''), // 模块默认位置
      'node_modules',
      path.resolve('src/style/utils'), // 模块默认位置
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader', 'react-hot-loader/webpack'],
        exclude: [/(node_modules)/],
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 15000,
              name: 'images/[name]_[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html', debug: true }), new LodashModuleReplacementPlugin()],
  // 警告 webpack 的性能提示
  performance: {
    hints: 'warning',
    // 入口起点的最大体积
    maxEntrypointSize: 50000000,
    // 生成文件的最大体积
    maxAssetSize: 30000000,
    // 只给出 js 文件的性能提示
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },
};
