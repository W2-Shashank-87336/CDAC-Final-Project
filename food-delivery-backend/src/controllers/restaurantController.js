const { conn } = require('../config/db');

// List all active restaurants
exports.listRestaurants = (req, res) => {
    const { lat, lon, radius } = req.query;

    let query = `SELECT * FROM restaurants WHERE isActive = 1`;
    const params = [];

    if (lat && lon && radius) {
        query += ` AND ST_Distance_Sphere(
            POINT(latitude, longitude), 
            POINT(?, ?)
        ) <= ?`;
        params.push(lat, lon, radius);
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json(results);
    });
};

// Get details of a specific restaurant
exports.getRestaurantDetails = (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM restaurants WHERE id = ? AND isActive = 1`;

    conn.query(query, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Create a new restaurant
exports.createRestaurant = (req, res) => {
    const { name, description, addressLine1, latitude, longitude, ownerId } = req.body;

    if (!name || !description || !addressLine1 || !latitude || !longitude || !ownerId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO restaurants (name, description, addressLine1, latitude, longitude, ownerId, isActive) 
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `;

    conn.query(query, [name, description, addressLine1, latitude, longitude, ownerId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Restaurant created successfully', restaurantId: result.insertId });
    });
};

// Update restaurant details
exports.updateRestaurant = (req, res) => {
    const { id } = req.params;
    const { name, description, addressLine1, latitude, longitude } = req.body;

    const query = `
        UPDATE restaurants 
        SET name = ?, description = ?, addressLine1 = ?, latitude = ?, longitude = ? 
        WHERE id = ?
    `;

    conn.query(query, [name, description, addressLine1, latitude, longitude, id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant updated successfully' });
    });
};

// Deactivate/Delete a restaurant
exports.deleteRestaurant = (req, res) => {
    const { id } = req.params;

    const query = `
        UPDATE restaurants 
        SET isActive = 0 
        WHERE id = ?
    `;

    conn.query(query, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant deactivated successfully' });
    });
};
