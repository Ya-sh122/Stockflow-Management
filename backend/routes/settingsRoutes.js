const express = require('express');
const settingsController = require('../controllers/settingsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// get /api/settings
router.get('/', authMiddleware, settingsController.getSettings);

// put /api/settings
router.put('/', authMiddleware, settingsController.updateSettings);

module.exports = router;
