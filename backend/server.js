require('dotenv').load();

var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    app = module.exports = express(),
    passport = require('passport'),
    path = require('path'),
    db = require('./libs/db.js'),
    cookieParser = require('cookie-parser'),
    sessionStore = new SessionStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }), LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.locals.knex = db.initialize();

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
  app.locals.knex('user').where('id', id).then(function(user){
    console.log('=>>>>>', user)
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {

    console.log('email =>>>', username);
    console.log('password =>>>', password);

    app.locals.knex('user').where('email', username).then(function(user){

      if (!user) {
        console.log('LOG IN 1', user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (password !== user[0].password ) {
        console.log('LOG IN 2', user);
        return done(null, false, { message: 'Incorrect password.' });
      }



      return done(null, user[0]);
    });
  }
));


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

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);


app.use('/api/projects', require('./api/projects'));

var server = app.listen(process.env.PORT, process.env.HOST, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
