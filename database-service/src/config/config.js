require('dotenv').config();

const { DB_USERNAME, DB_HOSTNAME, DB_NAME, DB_DIALECT } = process.env;

module.exports = {
  development: {
    username: `${DB_USERNAME}`,
    password: null,
    database: `${DB_NAME}`,
    host: `${DB_HOSTNAME}`,
    dialect: `${DB_DIALECT}`,
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
