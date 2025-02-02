const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listCoupons,
    getCouponDetails,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');

const router = express.Router();

router.get('/:restaurantId/coupons', authenticate, listCoupons); // List coupons
router.get('/:restaurantId/coupons/:couponId', authenticate, getCouponDetails); // Get coupon details
router.post('/:restaurantId/coupons', authenticate, createCoupon); // Create a new coupon
router.patch('/:restaurantId/coupons/:couponId', authenticate, updateCoupon); // Update coupon details
router.delete('/:restaurantId/coupons/:couponId', authenticate, deleteCoupon); // Deactivate a coupon

module.exports = router;
