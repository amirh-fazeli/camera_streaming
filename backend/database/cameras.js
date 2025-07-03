const db = require('./db');

// Add cameras for a user: replace existing cameras with the given list
// camerasJson is an object like: { username: "user1", cameras: [ {uuid, camera_name, ip_address, port, stream_url}, ... ] }
function addCameras(username, camerasJson, callback) {
  // Start a transaction for safety and performance
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Delete all cameras for this user first
    db.run(`DELETE FROM cameras WHERE username = ?`, [username], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return callback(err);
      }

      // Prepare insert statement
      const insertStmt = db.prepare(`
        INSERT INTO cameras (username, uuid, camera_name, ip_address, port, stream_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      try {
        for (const cam of camerasJson.cameras) {
          insertStmt.run(
            username,
            cam.uuid || null,
            cam.camera_name || null,
            cam.ip_address || null,
            cam.port || null,
            cam.stream_url || null
          );
        }
      } catch (e) {
        db.run('ROLLBACK');
        return callback(e);
      }

      insertStmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          return callback(err);
        }
        db.run('COMMIT');
        callback(null);
      });
    });
  });
}

// Get all cameras for a user, return JSON { username, cameras: [...] }
function getCameras(username, callback) {
  const sql = `
    SELECT uuid, camera_name, ip_address, port, stream_url
    FROM cameras
    WHERE username = ?
  `;

  db.all(sql, [username], (err, rows) => {
    if (err) return callback(err);

    // Build JSON response format
    const result = {
      username: username,
      cameras: rows.map(row => ({
        uuid: row.uuid,
        camera_name: row.camera_name,
        ip_address: row.ip_address,
        port: row.port,
        stream_url: row.stream_url
      }))
    };

    callback(null, result);
  });
}

module.exports = {
  addCameras,
  getCameras
};
