var router = require('express').Router(),
    app = require('../server'),
    knex = app.get('knex');

router.get('/', function(req,res,next){
  knex('project').where({user_id: req.session.passport.user}).then(function(projects){
    res.json(projects);
  });
});

router.post('/', function(req, res, next){

  var user_id = req.session.passport.user,
      name = req.body.name;

  knex('project').insert({ user_id: user_id, name: name }).then(function(id){
    id = id[0];
    res.json({ id: id, user_id: user_id });
  });

});

router.put('/', function(req, res, next){
  var id = req.body.id,
      name = req.body.name;

  knex('project').where({ id: id}).update({ name: name }).then(function(id){
    res.json(true);
  });

});

router.delete('/:id', function(req, res, next){
  var id = req.params.id;

  knex('project').del().where({ id: id}).then(function(id){
    res.json(true);
  });

});


module.exports = router;
