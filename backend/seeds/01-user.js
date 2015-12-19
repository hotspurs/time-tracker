var faker = require('faker');

exports.seed = function(knex, Promise) {
  var tableName = 'user';

  var users = [];

  for( var i = 0; i < 15; i++ ){

    var user = {};
    user.email = faker.internet.email();
    user.name = faker.name.firstName();
    user.password = faker.internet.password();

    if(i%5 == 0){
      delete user.password;
      user.provider = 'vkontakte';
    }

    users.push(user);

  }

  return knex(tableName).del().then(function(){
    return knex.insert(users).into(tableName);
  });

};
