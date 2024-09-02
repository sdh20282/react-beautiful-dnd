const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3,
                  proposals: true
                },
              },
            ],
            [
              '@babel/preset-react',
              {
                runtime: 'automatic'
              }
            ],
          ],
          plugins: [
            [
              'babel-plugin-styled-components',
              {
                displayName: false,
                minify: true,
                transpileTemplateLiterals: true,
                pure: true,
              },
            ],
          ],
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: [
      '.js'
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
});