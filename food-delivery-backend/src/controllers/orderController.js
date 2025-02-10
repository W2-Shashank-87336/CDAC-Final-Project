const { conn } = require('../config/db');

// CUSTOMER ENDPOINTS

exports.listCustomerOrders = (req, res) => {
    const customerId = req.user.id; // Extracted from JWT token
    const { status } = req.query;

    let query = `
        SELECT 
            o.id AS orderId,
            o.status,
            o.total AS totalAmount,
            o.paymentMethod,
            o.created_at AS createdAt,
            r.id AS restaurantId,
            r.name AS restaurantName,
            r.addressLine1 AS restaurantAddress,
            r.latitude AS restaurantLatitude,
            r.longitude AS restaurantLongitude,
            a.id AS addressId,
            a.addressLine1 AS deliveryAddress,
            a.city AS deliveryCity,
            a.latitude AS deliveryLatitude,
            a.longitude AS deliveryLongitude,
            oi.itemId,
            oi.quantity,
            mi.itemName,
            mi.price AS itemPrice
        FROM orders o
        JOIN restaurants r ON o.restaurantId = r.id
        JOIN addresses a ON o.addressId = a.id
        JOIN order_items oi ON o.id = oi.orderId
        JOIN menu_items mi ON oi.itemId = mi.id
        WHERE o.customerId = ?
    `;

    const params = [customerId];

    if (status) {
        query += ` AND o.status = ?`;
        params.push(status);
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // Group orders
        const ordersMap = {};

        results.forEach(row => {
            if (!ordersMap[row.orderId]) {
                ordersMap[row.orderId] = {
                    orderId: row.orderId,
                    status: row.status,
                    totalAmount: row.totalAmount,
                    paymentMethod: row.paymentMethod,
                    createdAt: row.createdAt,
                    restaurant: {
                        id: row.restaurantId,
                        name: row.restaurantName,
                        address: row.restaurantAddress,
                        latitude: row.restaurantLatitude,
                        longitude: row.restaurantLongitude
                    },
                    address: {
                        id: row.addressId,
                        line: row.deliveryAddress,
                        city: row.deliveryCity,
                        latitude: row.deliveryLatitude,
                        longitude: row.deliveryLongitude
                    },
                    items: []
                };
            }

            ordersMap[row.orderId].items.push({
                itemId: row.itemId,
                name: row.itemName,
                price: row.itemPrice,
                quantity: row.quantity
            });
        });

        res.status(200).json(Object.values(ordersMap));
    });
};


// Create a new order
exports.createOrder = (req, res) => {
    const customerId = req.user.id; // Extracted from JWT token
    const { restaurantId, addressId, couponId, paymentMethod, items, total } = req.body;

    if (!restaurantId || !addressId || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or items' });
    }

    const query = `
        INSERT INTO orders (customerId, restaurantId, addressId, couponId, paymentMethod, total, status)
        VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    conn.query(query, [customerId, restaurantId, addressId, couponId, paymentMethod, total], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const orderId = result.insertId;

        if (items.length === 0) {
            return res.status(201).json({ message: 'Order created successfully', orderId });
        }

        // Prepare values for bulk insert
        const values = items.map(item => [orderId, item.itemId, item.quantity]);

        const itemQuery = 'INSERT INTO order_items (orderId, itemId, quantity) VALUES ?';

        conn.query(itemQuery, [values], (error) => {
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
exports.listRestaurantOrderss = (req, res) => {
    const restaurantId = req.params.restaurantId; // Get restaurantId from the route parameter
    const { status } = req.query; // Optional filter by status

    let query = `
        SELECT * FROM orders 
        WHERE restaurantId = ? 
    `;
    const params = [restaurantId]; // Initialize params with the restaurantId

    // If a status is provided, add it to the query and the params
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
