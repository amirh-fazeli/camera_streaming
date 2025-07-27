require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authUser = require('./middleware/authUser');
const authHelper = require('./middleware/authHelper');

const app = express();

// Enable CORS for all origins (development)
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Initialize database (creates tables if not exist)
require('./database/db');

// Auth routes
app.use('/auth', require('./routes/auth'));

// UI routes (protected by JWT)
app.use('/users', authUser, require('./routes/cameras'));

// Helper routes (protected by API key)
app.use('/helpers', authHelper, require('./routes/helper'));

const path = require('path');
app.use(
  '/streams',
  express.static(path.join(__dirname, '../cloud-receiver/public/streams'), {
    etag: false,
    maxAge: '0',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.m3u8')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  })
);


// Healthcheck
app.get('/', (req, res) => {
  res.send('Backend is running');
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
