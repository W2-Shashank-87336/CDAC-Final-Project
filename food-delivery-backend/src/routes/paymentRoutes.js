const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    razorpayWebhook,
    getPaymentInfo,
    initiatePayment,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/razorpay/webhook', razorpayWebhook); // Webhook for Razorpay payments
router.get('/:orderId', authenticate, getPaymentInfo); // Get payment info for a specific order
router.post('/pay', authenticate, initiatePayment); // Initiate payment session

module.exports = router;
