const { conn } = require('../config/db');

// List orders ready for pickup near the delivery partner
exports.listReadyForPickup = (req, res) => {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon || !radius) {
        return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
    }

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

// Accept a delivery
exports.acceptDelivery = (req, res) => {
    const { id } = req.params;
    const deliveryPartnerId = req.user.id; // Extracted from JWT token

    const query = `
        UPDATE orders 
        SET status = 'OUT_FOR_DELIVERY', deliveryPartnerId = ? 
        WHERE id = ? AND status = 'READY_FOR_PICKUP'
    `;

    conn.query(query, [deliveryPartnerId, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or not ready for pickup' });
        }

        res.status(200).json({ message: 'Delivery accepted successfully' });
    });
};

// Confirm delivery
exports.confirmDelivery = (req, res) => {
    const { id } = req.params;
    const deliveryPartnerId = req.user.id; // Extracted from JWT token
    const { paymentCollected } = req.body;

    const query = `
        UPDATE orders 
        SET status = 'DELIVERED', paymentCollected = ? 
        WHERE id = ? AND deliveryPartnerId = ? AND status = 'OUT_FOR_DELIVERY'
    `;

    conn.query(query, [paymentCollected ? 1 : 0, id, deliveryPartnerId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or not out for delivery' });
        }

        res.status(200).json({ message: 'Delivery confirmed successfully' });
    });
};
