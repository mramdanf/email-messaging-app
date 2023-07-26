require('dotenv').config();

const { DB_USERNAME, DB_HOSTNAME, DB_NAME, DB_PASSWORD, DB_DIALECT, DB_PORT } =
  process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logQueryParameters: true,
    timezone: '+07:00',
    logging: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
