const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src_website/components/index.js',
  output: {
    path: path.join(__dirname, 'static', 'js'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1!postcss'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        loader: ['babel-loader'],
        exclude: /node_modules/,
        query: {
          cacheDirectory: 'babel_cache',
          presets: ['latest', 'react'],
          plugins: ['transform-object-rest-spread', 'transform-object-assign']
        }
      }]
  },
  postcss: function () {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },
};