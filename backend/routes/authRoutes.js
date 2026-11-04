const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// post /api/auth/register
router.post('/register', authController.register);

// post /api/auth/login
router.post('/login', authController.login);

// get /api/auth/me
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
