const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    getProfile,
    updateProfile,
    listAddresses,
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress,
} = require('../controllers/profileController');

const router = express.Router();

router.get('/', authenticate, getProfile); // Get current user's profile
router.patch('/', authenticate, updateProfile); // Update user's profile
router.get('/addresses', authenticate, listAddresses); // List all addresses
router.post('/addresses', authenticate, createAddress); // Create a new address
router.get('/addresses/:addressId', authenticate, getAddress); // Get specific address info
router.patch('/addresses/:addressId', authenticate, updateAddress); // Update specific address
router.delete('/addresses/:addressId', authenticate, deleteAddress); // Delete specific address

module.exports = router;
