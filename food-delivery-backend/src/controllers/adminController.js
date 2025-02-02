const { conn } = require('../config/db');

// Get aggregated stats for the dashboard
exports.getDashboardStats = (req, res) => {
    const queries = {
        totalUsers: 'SELECT COUNT(*) AS totalUsers FROM users',
        totalOrders: 'SELECT COUNT(*) AS totalOrders FROM orders',
        totalRestaurants: 'SELECT COUNT(*) AS totalRestaurants FROM restaurants',
    };

    const results = {};

    const queryPromises = Object.entries(queries).map(([key, query]) =>
        new Promise((resolve, reject) => {
            conn.query(query, (error, result) => {
                if (error) {
                    return reject(error);
                }
                results[key] = result[0];
                resolve();
            });
        })
    );

    Promise.all(queryPromises)
        .then(() => {
            res.status(200).json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch dashboard stats' });
        });
};

// Get all orders in the system
exports.getAllOrders = (req, res) => {
    const query = `
        SELECT orders.*, users.fullName AS customerName, restaurants.name AS restaurantName 
        FROM orders
        JOIN users ON orders.customerId = users.id
        JOIN restaurants ON orders.restaurantId = restaurants.id
    `;

    conn.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Manage all restaurants
exports.getAllRestaurants = (req, res) => {
    const query = `SELECT * FROM restaurants`;

    conn.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Update system-level settings (example: toggling system maintenance mode)
exports.updateSystemSettings = (req, res) => {
    const { key, value } = req.body;

    if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
    }

    const query = `
        INSERT INTO system_settings (key, value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE value = VALUES(value)
    `;

    conn.query(query, [key, value], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update system settings' });
        }

        res.status(200).json({ message: 'System settings updated successfully' });
    });
};
