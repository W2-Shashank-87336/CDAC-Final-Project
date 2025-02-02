const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const {
    getDashboardStats,
    getAllOrders,
    getAllRestaurants,
    updateSystemSettings,
} = require('../controllers/adminController');

const router = express.Router();

// Ensure only Super Admins can access these routes
router.use(authenticate, authorize(['SUPER_ADMIN']));

router.get('/dashboard', getDashboardStats); // Aggregated stats for the dashboard
router.get('/orders', getAllOrders); // All orders in the system
router.get('/restaurants', getAllRestaurants); // Manage all restaurants
router.patch('/settings', updateSystemSettings); // System-level changes

module.exports = router;
