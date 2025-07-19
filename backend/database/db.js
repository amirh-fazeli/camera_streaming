const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cameras (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rtsp_url TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS helpers (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     api_key TEXT UNIQUE NOT NULL,
     srt_key TEXT NOT NULL,
     user_id INT REFERENCES users(id),
     created_at TIMESTAMP DEFAULT NOW()
   );
  `);
  console.log('Database initialized.');
}

initDB().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
});

module.exports = { pool };