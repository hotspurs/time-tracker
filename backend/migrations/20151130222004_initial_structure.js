exports.up = function(knex, Promise) {
  return knex.schema
  	.createTable('user', function(t){
  		t.increments().primary();
  		t.string('email', 30).notNullable();
  		t.string('password', 30).notNullable();
  	})
  	.createTable('project', function(t){
      t.increments().primary();
      t.string('name', 100);
  	})
    .createTable('tags', function(t){
      t.increments();

      t.integer('user_id').unsigned().notNullable().references('id').inTable('user');

      t.string('name', 100);
    })
    .createTable('time_entry', function(t){
    	t.increments();
      t.integer('user_id').unsigned().notNullable().references('id').inTable('user');
      t.integer('project_id').unsigned().notNullable().references('id').inTable('project');

    	t.string('description', 100);
    	t.timestamp('start_at');
    	t.timestamp('stop_at');
    	t.integer('duration');
    })
    .createTable('time_entries_tags', function(t){
      t.integer('tag_id').unsigned().notNullable().references('id').inTable('tags').onDelete('CASCADE');
      t.integer('time_entry_id').unsigned().notNullable().references('id').inTable('time_entry').onDelete('CASCADE');
      t.primary(['tag_id', 'time_entry_id']);
    });
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('user')
    .dropTable('project')
    .dropTable('tags')
    .dropTable('time_entry')
    .dropTable('time_entries_tags')
};
