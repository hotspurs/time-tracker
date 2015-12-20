var router = require('express').Router(),
    app = require('../server'),
    knex = app.get('knex');

router.get('/', function(req,res,next){
  knex('tags').where({user_id: req.session.passport.user}).then(function(tags){
    res.json(tags);
  });
});

router.post('/', function(req, res, next){

  var user_id = req.session.passport.user,
      name = req.body.name;

  knex('tags').returning('id').insert({ user_id: user_id, name: name }).then(function(id){
    res.json({ id: id });
  });

});

router.put('/', function(req, res, next){
  var id = req.body.id,
      name = req.body.name;

  knex('tags').where({ id: id}).update({ name: name }).then(function(id){
    res.json(true);
  });

});

router.delete('/', function(req, res, next){
  var id = req.body.id;

  knex('tags').del().where({ id: id}).then(function(id){
    res.json(true);
  });

});

module.exports = router;
