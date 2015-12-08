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
    }), LocalStrategy = require('passport-local').Strategy,
    VKontakteStrategy = require('passport-vkontakte').Strategy;

if (process.env.NODE_ENV === 'development') {
  var webpackMiddleware = require('./libs/webpack-middleware.js');
  app.use(webpackMiddleware.webpackDevMiddleware);
  app.use(webpackMiddleware.webpackHotMiddleware);
} else {
  app.use(express.static(path.join(__dirname, '../build')))
}

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

passport.use(new VKontakteStrategy({
    clientID:     5180715, // VK.com docs call it 'API ID'
    clientSecret: 'cd8dv8FcTWPtpt0m9hf0',
    callbackURL:  "http://local.dubov-developer.com:3000/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    app.locals.knex('user').insert({ email: profile.id, password: 12345 }).then(function(id){

      var user = {}
      user.id = id[0];

      done(null, user);
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {

    console.log('email =>>>', username);
    console.log('password =>>>', password);

    app.locals.knex('user').where('email', username).then(function(user){

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (password !== user[0].password ) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user[0]);
    });
  }
));

app.get('/', ensureAuthenticated, function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login',
                                                    failureFlash: false 
                                                  }));

app.get('/auth/vkontakte', passport.authenticate('vkontakte'), function(req, res){

});

app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', { 
  failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/api/projects', ensureAuthenticated, require('./api/projects'));

var server = app.listen(process.env.PORT, process.env.HOST, function() {
  var host = server.address().address,
      port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
