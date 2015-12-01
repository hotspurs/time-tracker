var faker = require('faker'),
    _ = require('underscore');

exports.seed = function(knex, Promise) {
  var tableName = 'tags';

  return knex.select('id').from('user').then(function(ids){
    var tags = [];

    userIds = ids.map(function(item){
       return item.id;
    });

    for( var i = 0; i < 50; i++ ){
      var tag = {};
      tag.name = faker.hacker.adjective();
      tag.user_id = _.sample(userIds);
      tags.push(tag);

    }
    
    return knex(tableName).del().then(function(){
      return knex.insert(tags).into(tableName);
    }); 
  });
};
