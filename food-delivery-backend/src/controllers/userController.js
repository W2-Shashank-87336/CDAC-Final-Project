const { conn } = require('../config/db');

// List all users with optional filters
exports.listUsers = (req, res) => {
    const { role, isActive } = req.query;

    let query = `SELECT id, fullName, email, phone, role, isActive FROM users`;
    const params = [];

    if (role || isActive) {
        query += ` WHERE `;
        const conditions = [];

        if (role) {
            conditions.push(`role = ?`);
            params.push(role);
        }

        if (isActive !== undefined) {
            conditions.push(`isActive = ?`);
            params.push(isActive ? 1 : 0);
        }

        query += conditions.join(' AND ');
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Get specific user details
exports.getUserDetails = (req, res) => {
    const { userId } = req.params;

    const query = `SELECT id, fullName, email, phone, role, isActive FROM users WHERE id = ?`;

    conn.query(query, [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Activate a user
exports.activateUser = (req, res) => {
    const { userId } = req.params;

    const query = `UPDATE users SET isActive = 1 WHERE id = ?`;

    conn.query(query, [userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User activated successfully' });
    });
};

// Deactivate a user
exports.deactivateUser = (req, res) => {
    const { userId } = req.params;

    const query = `UPDATE users SET isActive = 0 WHERE id = ?`;

    conn.query(query, [userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deactivated successfully' });
    });
};

// Create a delivery partner
exports.createDeliveryPartner = (req, res) => {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO users (fullName, email, phone, password, role, isActive)
        VALUES (?, ?, ?, ?, 'DELIVERY_PARTNER', 1)
    `;

    conn.query(query, [fullName, email, phone, password], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Delivery partner created successfully', userId: result.insertId });
    });
};
