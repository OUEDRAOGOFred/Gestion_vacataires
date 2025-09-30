module.exports = {
  development: {
    username: 'root',
    password: 'Freddy1243.',
    database: 'vacataires_db',
    host: 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
};