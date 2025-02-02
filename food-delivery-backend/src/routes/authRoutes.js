const express = require('express');
const { register, login, logout, refresh } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // User login
router.post('/logout', logout); // User logout
router.post('/refresh', refresh); // Refresh token

module.exports = router;
