var router = require('express').Router(),
    app = require('../server'),
    knex = app.get('knex');

router.get('/', function(req,res,next){
  knex('time_entries_tags').where({user_id: req.session.passport.user}).then(function(tags){
    res.json(tags);
  });
});


module.exports = router;
