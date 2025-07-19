const pool = require('../database/db').pool;

exports.listForHelper = async (req, res) => {
  const helperId = req.helperId;
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.rtsp_url, c.name
         FROM cameras c
         JOIN helpers h ON c.user_id = h.user_id
        WHERE h.id = $1`,
      [helperId]
    );
    res.json(rows);
  } catch (err) {
    console.error('listForHelper error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};