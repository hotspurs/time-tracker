var faker = require('faker'),
    _ = require('underscore'),
    moment = require('moment');

exports.seed = function(knex, Promise) {
  var tableName = 'time_entry';

  return knex.select('id', 'user_id').from('project').then(function(projects){
    var time_entries = [];

    for( var i = 0; i < 300; i++ ){
      var time_entry = {},
          project = _.sample(projects);

      time_entry.user_id = project.user_id;
      time_entry.project_id = project.id;

      time_entry.description = faker.lorem.sentence();
      time_entry.start_at = moment( faker.date.between( new Date( Date.now()-1000*60*60*24*7 ), 
                                                        new Date( Date.now() ) ) )
                            .format('YYYY-MM-DD HH:mm:ss');
      time_entry.stop_at =  moment( faker.date.between( moment(time_entry.start_at), 
                                                        new Date( +moment(time_entry.start_at) + 1000*60* _.random(10, 120) ) ) )
                            .format('YYYY-MM-DD HH:mm:ss');
      
      time_entries.push(time_entry);

    }
    
    return knex(tableName).del().then(function(){
      return knex.insert(time_entries).into(tableName);
    }); 
  });
};
