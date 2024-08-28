const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.jsx',
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '../dist'),
    filename: '[name].[chunkhash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
    ],
    alias: {
      '@components': path.resolve(__dirname, '../src/_components/index.js'),
      '@data': path.resolve(__dirname, '../src/_data/index.js'),
      '@styles': path.resolve(__dirname, '../src/_styles/index.js'),
      '@utils': path.resolve(__dirname, '../src/_utils/index.js'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    })
  ],
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: 3000,
    open: true,
  },
};