const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    submitRating,
    getRestaurantRatings,
    getDeliveryPartnerRatings,
} = require('../controllers/ratingController');

const router = express.Router();

router.post('/', authenticate, submitRating); // Submit a rating
router.get('/restaurant/:rid', getRestaurantRatings); // Get ratings for a restaurant
router.get('/delivery-partner/:pid', authenticate, getDeliveryPartnerRatings); // Get ratings for a delivery partner

module.exports = router;
