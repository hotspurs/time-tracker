var _ = require('underscore');

exports.seed = function(knex, Promise) {
  var tableName = 'time_entries_tags';

  return Promise.all([
    knex.select('id').from('time_entry'),
    knex.select('id').from('tags')
  ]).then(function(result){
     var time_entry_ids = result[0].map(function(item){
                            return item.id;
                          }),
         tags_ids = result[1].map(function(item){
                               return  item.id;
                            });

    var time_entries_tags = [];

    for(var i = 0; i<300; i++){
      var time_entry_tag = {};

      time_entry_tag.tag_id = _.sample(tags_ids);
      time_entry_tag.time_entry_id = _.sample(time_entry_ids);

      time_entries_tags.push(time_entry_tag);

    }


    time_entries_tags = _.filter(time_entries_tags, function (element, index) {
      for(index += 1; index < time_entries_tags.length; index += 1) {
          if (_.isEqual(element, time_entries_tags[index])) {
              return false;
          }
      }
      return true;
    });

    console.log('=>>>', time_entries_tags);


    return knex(tableName).del().then(function(){
      return knex.insert(time_entries_tags).into(tableName);
    });

  });

};
