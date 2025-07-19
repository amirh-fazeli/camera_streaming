const { pool } = require('../database/db');

module.exports = async (req, res, next) => {
  const key = req.header('x-api-key');
  if (!key) {
    return res.status(401).json({ error: 'Missing API key' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id FROM helpers WHERE api_key = $1',
      [key]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.helperId = rows[0].id;
    next();
  } catch (err) {
    console.error('authHelper error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
