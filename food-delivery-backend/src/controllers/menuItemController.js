const { conn } = require('../config/db');

// List all items in a menu
exports.listMenuItems = (req, res) => {
    const { restaurantId, menuId } = req.params;

    const query = `
        SELECT * FROM menu_items 
        WHERE restaurantId = ? AND menuId = ? AND isActive = 1
    `;

    conn.query(query, [restaurantId, menuId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
};

// Get details of a specific menu item
exports.getMenuItem = (req, res) => {
    const { restaurantId, menuId, itemId } = req.params;

    const query = `
        SELECT * FROM menu_items 
        WHERE id = ? AND menuId = ? AND restaurantId = ? AND isActive = 1
    `;

    conn.query(query, [itemId, menuId, restaurantId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json(results[0]);
    });
};

// Create a new menu item (with image upload)
exports.createMenuItem = (req, res) => {
    const { restaurantId, menuId } = req.params;
    const { itemName, description, price, isActive } = req.body;

    if (!itemName || !price) {
        return res.status(400).json({ error: 'Item name and price are required' });
    }

    // Get the image path from the uploaded file (if any)
    const imagePath = req.file ? req.file.path : null;

    const query = `
        INSERT INTO menu_items (menuId, restaurantId, itemName, description, price, image, isActive) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(
        query,
        [menuId, restaurantId, itemName, description, price, imagePath, isActive ? 1 : 0],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.status(201).json({ message: 'Menu item created successfully', itemId: result.insertId });
        }
    );
};

// Update a menu item (optionally update the image)
exports.updateMenuItem = (req, res) => {
    const { restaurantId, menuId, itemId } = req.params;
    const { itemName, description, price } = req.body;
    const imagePath = req.file ? req.file.path : null;

    let query;
    let values;

    if (imagePath) {
        // If a new image is uploaded, update the image column as well
        query = `
            UPDATE menu_items 
            SET itemName = ?, description = ?, price = ?, image = ? 
            WHERE id = ? AND menuId = ? AND restaurantId = ?
        `;
        values = [itemName, description, price, imagePath, itemId, menuId, restaurantId];
    } else {
        // Otherwise, update only the other fields
        query = `
            UPDATE menu_items 
            SET itemName = ?, description = ?, price = ? 
            WHERE id = ? AND menuId = ? AND restaurantId = ?
        `;
        values = [itemName, description, price, itemId, menuId, restaurantId];
    }

    conn.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item updated successfully' });
    });
};

// Delete/Deactivate a menu item
exports.deleteMenuItem = (req, res) => {
    const { restaurantId, menuId, itemId } = req.params;

    const query = `
        UPDATE menu_items 
        SET isActive = 0 
        WHERE id = ? AND menuId = ? AND restaurantId = ?
    `;

    conn.query(query, [itemId, menuId, restaurantId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deactivated successfully' });
    });
};
