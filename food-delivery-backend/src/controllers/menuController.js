const { conn } = require('../config/db');

// List all menus for a restaurant
exports.listMenus = (req, res) => {
    const { restaurantId } = req.params;

    const query = `
        SELECT * FROM menus 
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

// Get details of a specific menu
exports.getMenu = (req, res) => {
    const { restaurantId, menuId } = req.params;

    const query = `
        SELECT * FROM menus 
        WHERE id = ? AND restaurantId = ? AND isActive = 1
    `;

    conn.query(query, [menuId, restaurantId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Create a new menu
exports.createMenu = (req, res) => {
    const { restaurantId } = req.params;
    const { menuName, isActive } = req.body;

    if (!menuName) {
        return res.status(400).json({ error: 'Menu name is required' });
    }

    const query = `
        INSERT INTO menus (restaurantId, menuName, isActive) 
        VALUES (?, ?, ?)
    `;

    conn.query(query, [restaurantId, menuName, isActive ? 1 : 0], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Menu created successfully', data: result });
    });
};

// Update a menu
exports.updateMenu = (req, res) => {
    const { restaurantId, menuId } = req.params;
    const { menuName, isActive } = req.body;

    const query = `
        UPDATE menus 
        SET menuName = ?, isActive = ? 
        WHERE id = ? AND restaurantId = ?
    `;

    conn.query(query, [menuName, isActive ? 1 : 0, menuId, restaurantId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        res.status(200).json({ message: 'Menu updated successfully' });
    });
};

// Delete or deactivate a menu
exports.deleteMenu = (req, res) => {
    const { restaurantId, menuId } = req.params;

    const query = `
        UPDATE menus 
        SET isActive = 0 
        WHERE id = ? AND restaurantId = ?
    `;

    conn.query(query, [menuId, restaurantId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        res.status(200).json({ message: 'Menu deactivated successfully' });
    });
};
