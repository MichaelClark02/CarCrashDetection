const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }

  console.log('Connected to the users database');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

module.exports = db;
