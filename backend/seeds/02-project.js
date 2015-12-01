var faker = require('faker'),
    _ = require('underscore');

exports.seed = function(knex, Promise) {
  var tableName = 'project';


  return knex.select('id').from('user').then(function(ids){
    var projects = [],
        userIds;

    userIds = ids.map(function(item){
       return item.id;
    });

    for( var i = 0; i < 50; i++ ){
      var project = {};
      project.name = faker.hacker.adjective();
      project.user_id = _.sample(userIds);
      projects.push(project);

    }

    return knex(tableName).del().then(function(){
      return knex.insert(projects).into(tableName);
    }); 
  });
};
