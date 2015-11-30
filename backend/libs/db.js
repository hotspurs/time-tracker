var knex = require('knex');
var db_config = require('../knexfile.js').development;

module.exports = {
  initialize: function(){
    this.builder = knex(db_config);      
  }
}