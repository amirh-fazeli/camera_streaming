const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the database file path inside your backend folder
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Open or create the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Users table: username and password
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL
    )
  `);

  // Cameras table: username + 4 details (adjust columns as you want)
  db.run(`
    CREATE TABLE IF NOT EXISTS cameras (
      UUID INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      camera_name TEXT,
      ip_address TEXT,
      port INTEGER,
      stream_url TEXT,
      FOREIGN KEY(username) REFERENCES users(username)
    )
  `);
});

module.exports = db;
