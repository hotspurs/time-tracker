require('dotenv').load();

var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    app = module.exports = express(),
    path = require('path'),
    db = require('./libs/db.js'),
    cookieParser = require('cookie-parser'),
    sessionStore = new SessionStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }),
    knex,
    auth = require('./libs/auth.js'),
    router = require('./router.js');

app.use(express.static(path.join(__dirname, '../frontend/src/')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('knex', db.initialize());
knex = app.get('knex');

app.use(session({
    key: 'sid',
    secret: 'secretString',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    }
}));

auth.initialize();
app.use(router);
app.use('/api/projects', auth.ensureAuthenticated, require('./api/projects'));
app.use('/api/tags', auth.ensureAuthenticated, require('./api/tags'));
app.use('/api/time_entry', auth.ensureAuthenticated, require('./api/time_entry'));
app.use('/api/time_entries_tags', auth.ensureAuthenticated, require('./api/time_entries_tags'));

var server = app.listen(process.env.PORT, process.env.HOST, function() {
  var host = server.address().address,
      port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
