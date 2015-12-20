exports.up = function(knex, Promise) {
  return knex.schema
  	.createTable('user', function(table){
  		table.increments();
  		table.string('email', 100).notNullable();
  		table.string('password', 100);
      table.string('provider', 100);
      table.string('name', 100);
  	})
  	.createTable('project', function(table){
      table.increments();

      table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');

      table.string('name', 100);
  	})
    .createTable('tags', function(table){
      table.increments();

      table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');

      table.string('name', 100);
    })
    .createTable('time_entry', function(table){
    	table.increments();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.integer('project_id').unsigned();

    	table.string('description', 200);
    	table.timestamp('start_at');
    	table.timestamp('stop_at');
    })
    .createTable('time_entries_tags', function(table){
      table.integer('tag_id').unsigned().notNullable().references('id').inTable('tags').onDelete('CASCADE');
      table.integer('time_entry_id').unsigned().notNullable().references('id').inTable('time_entry').onDelete('CASCADE');
      table.primary(['tag_id', 'time_entry_id']);
    });
};

exports.down = function(knex, Promise) {
	return knex.schema
    .dropTable('time_entries_tags')
    .dropTable('time_entry')
    .dropTable('tags')
    .dropTable('project')
		.dropTable('user')
};
