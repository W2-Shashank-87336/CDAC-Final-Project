const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listReadyForPickup,
    acceptDelivery,
    confirmDelivery,
} = require('../controllers/deliveryController');

const router = express.Router();

router.get('/ready-for-pickup', authenticate, listReadyForPickup); // List orders ready for pickup
router.patch('/:id/accept-delivery', authenticate, acceptDelivery); // Accept a delivery
router.patch('/:id/delivered', authenticate, confirmDelivery); // Confirm delivery

module.exports = router;
