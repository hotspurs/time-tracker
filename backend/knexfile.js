module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host     : '127.0.0.1',
      user     : 'hotspurs',
      password : '12345',
      database : 'time_tracker'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
