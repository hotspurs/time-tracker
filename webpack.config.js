var path = require('path'),
    webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client',
          './frontend/App.jsx'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
    publicPath: ''
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot','babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!autoprefixer-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
      },
      {
        test: /\.(png|jpg|ttf|eot)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  resolve: {
    root: path.join(__dirname, 'frontend'),
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'frontend',
      'node_modules',
    ]
  },
  devtool : '#inline-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
