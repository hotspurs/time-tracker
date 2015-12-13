var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    VKontakteStrategy = require('passport-vkontakte').Strategy,
    app = require('../server'),
    knex;

module.exports = {
  initialize: function(){
    knex = app.get('knex');
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      knex('user').where('id', id).then(function(user){
        done(null, user);
      });
    });

    passport.use(new VKontakteStrategy({
        clientID: 5180715,
        clientSecret: 'cd8dv8FcTWPtpt0m9hf0',
        callbackURL:  "http://local.dubov-developer.com:3000/auth/vkontakte/callback",
        profileFields: ['email']
      },
      function(accessToken, refreshToken, params, profile, done) {

        console.log('=>>>>', params.email);

        knex('user').insert({ email: profile.id, password: 12345 }).then(function(id){

          var user = {}
          user.id = id[0];

          done(null, user);
        });
      }
    ));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(username, password, done) {

        knex('user').where('email', username).then(function(user){

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

    app.use(passport.initialize());
    app.use(passport.session());
  },
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }
}
