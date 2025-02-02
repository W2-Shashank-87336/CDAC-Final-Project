const { conn } = require('../config/db');

// CUSTOMER ENDPOINTS

// List orders for the logged-in customer
exports.listCustomerOrders = (req, res) => {
    const customerId = req.user.id; // Extracted from JWT token
    const { status } = req.query;

    let query = `SELECT * FROM orders WHERE customerId = ?`;
    const params = [customerId];

    if (status) {
        query += ` AND status = ?`;
        params.push(status);
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Create a new order
exports.createOrder = (req, res) => {
    const customerId = req.user.id; // Extracted from JWT token
    const { restaurantId, addressId, couponId, paymentMethod, items } = req.body;

    if (!restaurantId || !addressId || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or items' });
    }

    const query = `
        INSERT INTO orders (customerId, restaurantId, addressId, couponId, paymentMethod, status)
        VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;

    conn.query(query, [customerId, restaurantId, addressId, couponId, paymentMethod], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const orderId = result.insertId;

        // Insert items into order_items table
        const itemQueries = items.map(item => `
            INSERT INTO order_items (orderId, itemId, quantity) VALUES (${orderId}, ${item.itemId}, ${item.quantity});
        `);

        conn.query(itemQueries.join(' '), (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to add items to the order' });
            }

            res.status(201).json({ message: 'Order created successfully', orderId });
        });
    });
};

// Get details of one order (for the customer)
exports.getCustomerOrderDetails = (req, res) => {
    const { id } = req.params;
    const customerId = req.user.id; // Extracted from JWT token

    const query = `
        SELECT * FROM orders WHERE id = ? AND customerId = ?
    `;

    conn.query(query, [id, customerId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Cancel an order
exports.cancelOrder = (req, res) => {
    const { id } = req.params;
    const customerId = req.user.id; // Extracted from JWT token

    const query = `
        UPDATE orders SET status = 'CANCELED'
        WHERE id = ? AND customerId = ? AND status = 'PENDING'
    `;

    conn.query(query, [id, customerId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or cannot be canceled' });
        }

        res.status(200).json({ message: 'Order canceled successfully' });
    });
};

// RESTAURANT OWNER ENDPOINTS

// List orders for the owner’s restaurant(s)
exports.listRestaurantOrders = (req, res) => {
    const ownerId = req.user.id; // Extracted from JWT token
    const { status } = req.query;

    let query = `
        SELECT * FROM orders 
        WHERE restaurantId IN (SELECT id FROM restaurants WHERE ownerId = ?)
    `;
    const params = [ownerId];

    if (status) {
        query += ` AND status = ?`;
        params.push(status);
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Accept an order
exports.acceptOrder = (req, res) => {
    const { id } = req.params;

    const query = `
        UPDATE orders SET status = 'ACCEPTED' 
        WHERE id = ? AND status = 'PENDING'
    `;

    conn.query(query, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or cannot be accepted' });
        }

        res.status(200).json({ message: 'Order accepted successfully' });
    });
};

// Reject an order
exports.rejectOrder = (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const query = `
        UPDATE orders SET status = 'REJECTED', rejectionReason = ?
        WHERE id = ? AND status = 'PENDING'
    `;

    conn.query(query, [reason, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or cannot be rejected' });
        }

        res.status(200).json({ message: 'Order rejected successfully' });
    });
};

// Set order to PREPARING
exports.prepareOrder = (req, res) => {
    const { id } = req.params;

    const query = `
        UPDATE orders SET status = 'PREPARING' 
        WHERE id = ? AND status = 'ACCEPTED'
    `;

    conn.query(query, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({ message: 'Order set to preparing successfully' });
    });
};

// Set order to READY_FOR_PICKUP
exports.readyForPickup = (req, res) => {
    const { id } = req.params;

    const query = `
        UPDATE orders SET status = 'READY_FOR_PICKUP' 
        WHERE id = ? AND status = 'PREPARING'
    `;

    conn.query(query, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({ message: 'Order set to ready for pickup' });
    });
};

// DELIVERY PARTNER ENDPOINTS

// List orders ready for pickup near the partner
exports.listReadyForPickup = (req, res) => {
    const { lat, lon, radius } = req.query;

    const query = `
        SELECT * FROM orders 
        WHERE status = 'READY_FOR_PICKUP' 
        AND ST_Distance_Sphere(POINT(latitude, longitude), POINT(?, ?)) <= ?
    `;

    conn.query(query, [lat, lon, radius], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Accept delivery
exports.acceptDelivery = (req, res) => {
    const deliveryPartnerId = req.user.id; // Extracted from JWT token
    const { id } = req.params;

    const query = `
        UPDATE orders SET status = 'OUT_FOR_DELIVERY', deliveryPartnerId = ? 
        WHERE id = ? AND status = 'READY_FOR_PICKUP'
    `;

    conn.query(query, [deliveryPartnerId, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({ message: 'Delivery accepted successfully' });
    });
};

// Confirm delivery
exports.confirmDelivery = (req, res) => {
    const { id } = req.params;
    const { paymentCollected } = req.body;

    const query = `
        UPDATE orders SET status = 'DELIVERED', paymentCollected = ? 
        WHERE id = ? AND status = 'OUT_FOR_DELIVERY'
    `;

    conn.query(query, [paymentCollected ? 1 : 0, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({ message: 'Order delivered successfully' });
    });
};
