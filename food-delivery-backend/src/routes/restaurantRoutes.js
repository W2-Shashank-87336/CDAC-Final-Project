const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listRestaurants,
    getRestaurantDetails,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', listRestaurants); // List all active restaurants
router.get('/:id', authenticate, getRestaurantDetails); // Get details of a specific restaurant
router.post('/', authenticate, createRestaurant); // Create a new restaurant
router.patch('/:id', authenticate, updateRestaurant); // Update restaurant details
router.delete('/:id', authenticate, deleteRestaurant); // Deactivate/Delete a restaurant

module.exports = router;
