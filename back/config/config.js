const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  "development": {
    "username": "reactsns",
    "password": process.env.DB_PASSWORD,
    "database": "react_sns",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "test": {
    "username": "reactsns",
    "password": process.env.DB_PASSWORD,
    "database": "react_sns",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "production": {
    "username": "reactsns",
    "password": process.env.DB_PASSWORD,
    "database": "react_sns",
    "host": "127.0.0.1",
    "dialect": "mysql",
  }
}
