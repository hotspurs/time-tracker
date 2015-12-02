require('dotenv').load();

var express = require('express'),
    app = express(),
    path = require('path'),
    db = require('./libs/db.js');

db.initialize();

if (process.env.NODE_ENV === 'development') {
  var webpackMiddleware = require('./libs/webpack-middleware.js');
  app.use(webpackMiddleware.webpackDevMiddleware);
  app.use(webpackMiddleware.webpackHotMiddleware);
} else {
  app.use(express.static(path.join(__dirname, '../build')))
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

var server = app.listen(process.env.PORT, process.env.HOST, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
