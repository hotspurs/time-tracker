var faker = require('faker');

exports.seed = function(knex, Promise) {
  var tableName = 'user';

  var users = [];

  for( var i = 0; i < 15; i++ ){

    var user = {};
    user.email = faker.internet.email();
    user.password = faker.internet.password();

    users.push(user);

  }

  return knex(tableName).del().then(function(){
    return knex.insert(users).into(tableName);
  });

};
