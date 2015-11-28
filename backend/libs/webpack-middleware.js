var webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    config = require('../../webpack.config.js');

var compiler = webpack(config);

module.exports = {
  webpackDevMiddleware: webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }),
  webpackHotMiddleware: webpackHotMiddleware(compiler, {
    reload: true
  })
}