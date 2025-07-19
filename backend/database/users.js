const bcrypt = require('bcrypt');
const { pool } = require('./db');

const SALT_ROUNDS = 10;

async function addUser(username, password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, hash]
  );
  return result.rows[0];
}

async function verifyUser(username, password) {
  const res = await pool.query(
    `SELECT id, password_hash FROM users WHERE username = $1`,
    [username]
  );
  if (res.rowCount === 0) return null;
  const { id, password_hash } = res.rows[0];
  const ok = await bcrypt.compare(password, password_hash);
  return ok ? { id, username } : null;
}

module.exports = { addUser, verifyUser };