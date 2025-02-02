const { conn } = require('../config/db');

// Submit a rating for a delivered order
exports.submitRating = (req, res) => {
    const { orderId, restaurantRating, deliveryRating, comment } = req.body;
    const customerId = req.user.id; // Extracted from JWT token

    if (!orderId || !restaurantRating || !deliveryRating) {
        return res.status(400).json({ error: 'Order ID, restaurant rating, and delivery rating are required' });
    }

    const query = `
        INSERT INTO ratings (orderId, customerId, restaurantRating, deliveryRating, comment) 
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(query, [orderId, customerId, restaurantRating, deliveryRating, comment], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Rating submitted successfully' });
    });
};

// Get all ratings for a restaurant
exports.getRestaurantRatings = (req, res) => {
    const { rid } = req.params;

    const query = `SELECT * FROM ratings WHERE restaurantId = ?`;

    conn.query(query, [rid], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Get all ratings for a delivery partner
exports.getDeliveryPartnerRatings = (req, res) => {
    const { pid } = req.params;

    const query = `SELECT * FROM ratings WHERE deliveryPartnerId = ?`;

    conn.query(query, [pid], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};
