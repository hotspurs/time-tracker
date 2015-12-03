var router = require('express').Router(),
    app = require('../server'),
    knex = app.locals.knex;

router.get('/', function(req,res,next){

  knex('project').then(function(projects){
    res.json(projects);
  });

});

router.post('/', function(req, res, next){

  var user_id = req.body.user_id,
      name = req.body.name;

  knex('project').returning('id').insert({ user_id: user_id, name: name }).then(function(id){
    res.json({ id: id });
  });

});

router.delete('/', function(req, res, next){
  var id = req.body.id;

  knex('project').del().where({ id: id}).then(function(id){
    res.json(true);
  });

});

module.exports = router;
