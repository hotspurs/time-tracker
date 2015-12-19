var express = require('express'),
    app = require('./server'),
    passport = require('passport'),
    router = express.Router(),
    auth = require('./libs/auth.js'),
    path = require('path'),
    knex;

router.get('/', auth.ensureAuthenticated, function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

router.post('/register', function(req, res, next){

  knex = app.get('knex');

  var email = req.body.email,
      name = req.body.name,
      password = req.body.password;


  knex('user').where({ email: email }).then(function(user){
    user = !(user.length > 0) ? false : user[0];
    
    if(!user){
      return knex('user').insert({ email: email, password: password, name: name})
    }
    else{
      res.json({message:'Email уже используется'});
      return false;
    }
  }).then(function(user){

    if(!user) next();

    user = !(user.length > 0) ? false : user[0];

    userObj = {};

    userObj.id = user;

    req.logIn(userObj, function(err) {
      if (err) { return next(err); }

      res.json({redirect: true});
    });

  })


});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.json(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      res.json({redirect: true});
    });
  })(req, res, next);
});

router.get('/auth/vkontakte', passport.authenticate('vkontakte', { scope: ['email'] }), function(req, res){

});

router.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }), 
  function(req, res) {
      res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
