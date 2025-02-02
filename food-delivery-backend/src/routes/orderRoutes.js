const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listCustomerOrders,
    createOrder,
    getCustomerOrderDetails,
    cancelOrder,
    listRestaurantOrders,
    acceptOrder,
    rejectOrder,
    prepareOrder,
    readyForPickup,
    listReadyForPickup,
    acceptDelivery,
    confirmDelivery,
} = require('../controllers/orderController');

const router = express.Router();

// CUSTOMER ENDPOINTS
router.get('/', authenticate, listCustomerOrders); // List orders for the logged-in customer
router.post('/', authenticate, createOrder); // Create a new order
router.get('/:id', authenticate, getCustomerOrderDetails); // Get details of a specific order
router.patch('/:id/cancel', authenticate, cancelOrder); // Cancel an order

// RESTAURANT OWNER ENDPOINTS
router.get('/restaurant', authenticate, listRestaurantOrders); // List orders for the owner’s restaurant(s)
router.patch('/:id/accept', authenticate, acceptOrder); // Accept an order
router.patch('/:id/reject', authenticate, rejectOrder); // Reject an order
router.patch('/:id/prepare', authenticate, prepareOrder); // Set order status to PREPARING
router.patch('/:id/ready-for-pickup', authenticate, readyForPickup); // Set order status to READY_FOR_PICKUP

// DELIVERY PARTNER ENDPOINTS
router.get('/delivery', authenticate, listReadyForPickup); // List orders ready for pickup near partner
router.patch('/:id/accept-delivery', authenticate, acceptDelivery); // Accept delivery
router.patch('/:id/delivered', authenticate, confirmDelivery); // Confirm delivery

module.exports = router;
