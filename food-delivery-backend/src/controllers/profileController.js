const { conn } = require('../config/db');

// Get current user's profile
exports.getProfile = (req, res) => {
    const userId = req.user.id;

    const query = `SELECT id, fullName, email, phone, role FROM users WHERE id = ?`;

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

// Update current user's profile
exports.updateProfile = (req, res) => {
    const userId = req.user.id;
    const { fullName, phone } = req.body;

    const query = `
        UPDATE users 
        SET fullName = ?, phone = ? 
        WHERE id = ?
    `;

    conn.query(query, [fullName, phone, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
};

// List all addresses of the current user
exports.listAddresses = (req, res) => {
    const userId = req.user.id;

    const query = `SELECT * FROM addresses WHERE userId = ?`;

    conn.query(query, [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Create a new address
exports.createAddress = (req, res) => {
    const userId = req.user.id;
    const { addressLine1, city, latitude, longitude } = req.body;

    if (!addressLine1 || !city || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO addresses (userId, addressLine1, city, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(query, [userId, addressLine1, city, latitude, longitude], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Address created successfully', addressId: result.insertId });
    });
};

// Get specific address info
exports.getAddress = (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.params;

    const query = `SELECT * FROM addresses WHERE id = ? AND userId = ?`;

    conn.query(query, [addressId, userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Update a specific address
exports.updateAddress = (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { addressLine1, city, latitude, longitude } = req.body;

    const query = `
        UPDATE addresses 
        SET addressLine1 = ?, city = ?, latitude = ?, longitude = ? 
        WHERE id = ? AND userId = ?
    `;

    conn.query(query, [addressLine1, city, latitude, longitude, addressId, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.status(200).json({ message: 'Address updated successfully' });
    });
};

// Remove an address
exports.deleteAddress = (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.params;

    const query = `DELETE FROM addresses WHERE id = ? AND userId = ?`;

    conn.query(query, [addressId, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.status(200).json({ message: 'Address removed successfully' });
    });
};
