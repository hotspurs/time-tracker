var _ = require('underscore');

exports.seed = function(knex, Promise) {
  var tableName = 'time_entries_tags';

  return Promise.all([
    knex.select('id','user_id').from('time_entry'),
    knex.select('id','user_id').from('tags')
  ]).then(function(result){
     var time_entry_ids = result[0].map(function(item){
                            return {id: item.id, user_id: item.user_id};
                          }),
         tags_ids = result[1].map(function(item){
                               return  {id: item.id, user_id: item.user_id};
                            });

    var time_entries_tags = [];

    for(var i = 0; i<300; i++){
      var time_entry_tag = {};

      var tagObj = _.sample(tags_ids);

      time_entry_tag.tag_id = tagObj.id;
      time_entry_tag.time_entry_id = _.where(time_entry_ids, {user_id: tagObj.user_id})[0].id;

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

    return knex(tableName).del().then(function(){
      return knex.insert(time_entries_tags).into(tableName);
    });

  });

};
