const express = require('express');
const { register, login, logout, refresh } = require('../controllers/authController');
const { upload, setUploadType } = require('../config/multerConfig');


const router = express.Router();

router.post('/register', setUploadType('profile'), upload.single('profileImage'), register);
router.post('/login', login); // User login
router.post('/logout', logout); // User logout
router.post('/refresh', refresh); // Refresh token
module.exports = router;
