const { pool } = require('./db');

async function getCamerasByUsername(username) {
  const res = await pool.query(
    `SELECT c.id, c.rtsp_url, c.name
     FROM cameras c
     JOIN users u ON c.user_id = u.id
     WHERE u.username = $1
     ORDER BY c.id`,
    [username]
  );
  return res.rows;
}

async function addCamera(username, rtsp_url, name) {
  const userRes = await pool.query(
    `SELECT id FROM users WHERE username = $1`,
    [username]
  );
  if (userRes.rowCount === 0) {
    throw new Error(`User '${username}' not found`);
  }
  const userId = userRes.rows[0].id;

  let finalName = name && name.trim();
  if (!finalName) {
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM cameras WHERE user_id = $1`,
      [userId]
    );
    const index = parseInt(countRes.rows[0].count, 10) + 1;
    finalName = `Camera ${index}`;
  }

  // Insert
  const insertRes = await pool.query(
    `INSERT INTO cameras (user_id, rtsp_url, name)
     VALUES ($1, $2, $3)
     RETURNING id, rtsp_url, name, created_at`,
    [userId, rtsp_url, finalName]
  );
  return insertRes.rows[0];
}

module.exports = { getCamerasByUsername, addCamera };
