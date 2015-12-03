var knex = require('knex');
var db_config = require('../knexfile.js').development;

module.exports = {
  initialize: function(){
    return knex(db_config);      
  }
}
