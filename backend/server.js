require('dotenv').load();

var express = require('express'),
    bodyParser = require('body-parser'),
    app = module.exports = express(),
    path = require('path'),
    db = require('./libs/db.js');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.locals.knex = db.initialize();

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

app.use('/api/projects', require('./api/projects'));

var server = app.listen(process.env.PORT, process.env.HOST, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
