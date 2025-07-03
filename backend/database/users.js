const db = require('./db');

// Add a new user
function addUser(username, password, callback) {
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, password], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null); // success
  });
}

// Verify user login: check if username exists and password matches
function verifyUser(username, password, callback) {
  const sql = `SELECT password FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, false); // user not found
    // Simple password check (in real apps, hash the password!)
    if (row.password === password) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}

module.exports = {
  addUser,
  verifyUser
};
