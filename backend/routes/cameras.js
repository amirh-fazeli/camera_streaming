// backend/routes/cameras.js
const express = require('express');
const router  = express.Router();
const cameraCtrl = require('../controllers/cameraController');

// UI: list cameras for a given user
// GET /users/:username/cameras
router.get('/:username/cameras', cameraCtrl.listForUI);

// UI: add a camera for a given user
// POST /users/:username/cameras
router.post('/:username/cameras', cameraCtrl.addForUI);

module.exports = router;
