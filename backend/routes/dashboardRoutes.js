const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// get /api/dashboard
router.get('/', authMiddleware, dashboardController.getSummary);

module.exports = router;
