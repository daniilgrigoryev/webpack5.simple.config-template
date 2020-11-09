const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { argv } = require('process')

module.exports = (env, argv) => {
  const dev = argv.mode === 'development' ? true : false
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: dev ? '[name].js' : '[name].[hash].bundle.js',
      assetModuleFilename: 'images/[hash][ext][query]',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: 'asset/inline',
        },
        {
          test: /\.svg/,
          type: 'asset/resource',
        }
      ],
    },
    devServer: {
      open: true,
      bonjour: true,
      compress: true,
      hot: true,
      inline: true,
      contentBase: path.join(__dirname, 'build'),
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        'react-dom': '@hot-loader/react-dom',
      },
      extensions: ['*', '.js', '.jsx', '.css'],
    },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
    optimization: {
      minimize: true,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        cache: false,
      }),
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [ 'svgo', { plugins: [ { removeViewBox: false, }, ], }, ],
          ],
        },
      })
    ],
  }
}
