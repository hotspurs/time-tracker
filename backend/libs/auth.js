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

        var name = profile.name.givenName,
            provider = profile.provider,
            email = params.email;


        knex('user').where({ email: email }).then(function(user){
          user = !(user.length > 0) ? false : user[0];
          
          if(!user){
            return knex('user').insert({ email: email, provider: provider, name: name})
          }
          else{
            done(null, user);
            return false;
          }
        })
        .then(function(ids){

          if(!ids) return;

          var user = {}
          user.id = ids[0];
          done(null, user);
        });

      }
    ));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done){
        knex('user').where('email', email).then(function(user){

          user = !(user.length > 0) ? false : user[0];

          if (!user) {
            return done(null, false, { message: 'Неправильный email' });
          }
          if (password !== user.password ) {
            return done(null, false, { message: 'Неправильный пароль' });
          }

          return done(null, user);
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
