const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const buildDate = new Date().toISOString()

module.exports = {
  // main entry of the app
  entry: ['./Frontend/app/app.js', './Frontend/assets/sass/app.sass'],

  // output configuration
  output: {
    path: path.resolve(__dirname, './Public/'),
    filename: 'js/app.js',
    publicPath: '/'
  },

  module: {
    rules: [
      // process *.vue files using vue-loader
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'autoprefixer-loader' },
            { loader: 'sass-loader?indentedSytax' },
          ]
        }),
        exclude: /node_modules/
      },

      {
        test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[hash:7].[ext]'
        }
      },

      {
        test: /\.(woff|woff2)$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]"
      }

    ]
  },

  externals: {
    fs: '{}',
    module: '{}'
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    publicPath: path.resolve(__dirname, './Public/'),
    proxy: {
      '*': {
        target: 'http://localhost:8080',
        secure: false
      }
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      RELEASE: JSON.stringify(buildDate)
    }),
    new CleanWebpackPlugin(['Public/*.js*', 'Public/*.json', 'Public/js', 'Public/css'], {
      root: __dirname,
      verbose: true
    }),
    new WriteFilePlugin(),
    new ExtractTextPlugin({
      filename: 'css/app.css',
      allChunks: true
    })
  ],

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.common.js',
      config: (fs.statSync(configPath()) ? configPath() : configPath('production')),
      'assets': path.join(__dirname, 'Frontend', 'assets'),
      'images': path.join(__dirname, 'Frontend', 'assets', 'images')
    }
  },

  devtool: 'source-map'
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = false
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
    new BabiliPlugin()
    // new webpack.loaderOptionsPlugin({ minimize: true })
  ])
}

function configPath(environment) {
  var env = environment || process.env.NODE_ENV
  return path.join(__dirname, 'Frontend', 'app', 'config', env) + '.js'
}
