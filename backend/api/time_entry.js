var router = require('express').Router(),
    app = require('../server'),
    knex = app.get('knex');

router.get('/', function(req,res,next){
  knex('time_entry').where({user_id: req.session.passport.user}).then(function(tags){
    res.json(tags);
  });
});

router.post('/', function(req, res, next){

  var user_id = req.session.passport.user,
      project_id = req.body.project_id,
      description = req.body.description || null,
      start_at = req.body.start_at,
      stop_at = req.body.stop_at || null;


  knex('time_entry').returning('id').insert({ 
    user_id: user_id,
    project_id: project_id,
    description: description,
    start_at: start_at,
    stop_at: stop_at
  }).then(function(id){
    res.json({ id: id });
  });

});

router.put('/', function(req, res, next){
  var id = req.body.id,
      project_id = req.body.project_id,
      description = req.body.description || null,
      start_at = req.body.start_at,
      stop_at = req.body.stop_at;

  knex('time_entry').where({ id: id}).insert({ 
    project_id: project_id,
    description: description,
    start_at: start_at,
    stop_at: stop_at
  }).then(function(id){
    res.json(true);
  });

});

router.delete('/', function(req, res, next){
  var id = req.body.id;

  knex('time_entry').del().where({ id: id}).then(function(id){
    res.json(true);
  });

});

module.exports = router;
