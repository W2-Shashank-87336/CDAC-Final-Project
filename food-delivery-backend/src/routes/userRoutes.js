const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listUsers,
    getUserDetails,
    activateUser,
    deactivateUser,
    createDeliveryPartner,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticate, listUsers); // List all users
router.get('/:userId', authenticate, getUserDetails); // Get specific user details
router.patch('/:userId/activate', authenticate, activateUser); // Activate a user
router.patch('/:userId/deactivate', authenticate, deactivateUser); // Deactivate a user
router.post('/delivery-partner', authenticate, createDeliveryPartner); // Create a delivery partner

module.exports = router;
