// backend/routes/helper.js
const express = require('express');
const router  = express.Router();
const helperCtrl = require('../controllers/helperController');

// Helper‐box polling: list RTSP URLs for this helper
// GET /helpers/:helperId/cameras
router.get('/:helperId/cameras', helperCtrl.listForHelper);

module.exports = router;
