const { conn } = require('../config/db');

// List all coupons for a restaurant
exports.listCoupons = (req, res) => {
    const { restaurantId } = req.params;

    const query = `
        SELECT * FROM coupons 
        WHERE restaurantId = ? AND isActive = 1
    `;

    conn.query(query, [restaurantId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Get details of a specific coupon
exports.getCouponDetails = (req, res) => {
    const { restaurantId, couponId } = req.params;

    const query = `
        SELECT * FROM coupons 
        WHERE id = ? AND restaurantId = ? AND isActive = 1
    `;

    conn.query(query, [couponId, restaurantId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Create a new coupon
exports.createCoupon = (req, res) => {
    const { restaurantId } = req.params;
    const { code, discountType, discountValue, validFrom, validTo } = req.body;

    if (!code || !discountType || !discountValue || !validFrom || !validTo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO coupons (restaurantId, code, discountType, discountValue, validFrom, validTo, isActive) 
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `;

    conn.query(query, [restaurantId, code, discountType, discountValue, validFrom, validTo], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Coupon created successfully', couponId: result.insertId });
    });
};

// Update a coupon
exports.updateCoupon = (req, res) => {
    const { restaurantId, couponId } = req.params;
    const { discountValue, validTo } = req.body;

    const query = `
        UPDATE coupons 
        SET discountValue = ?, validTo = ? 
        WHERE id = ? AND restaurantId = ?
    `;

    conn.query(query, [discountValue, validTo, couponId, restaurantId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon updated successfully' });
    });
};

// Delete/Deactivate a coupon
exports.deleteCoupon = (req, res) => {
    const { restaurantId, couponId } = req.params;

    const query = `
        UPDATE coupons 
        SET isActive = 0 
        WHERE id = ? AND restaurantId = ?
    `;

    conn.query(query, [couponId, restaurantId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon deactivated successfully' });
    });
};
