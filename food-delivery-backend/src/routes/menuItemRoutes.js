const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuItemController');

const router = express.Router();

router.get('/:restaurantId/menus/:menuId/items', listMenuItems); // List items in a menu
router.get('/:restaurantId/menus/:menuId/items/:itemId', getMenuItem); // Get details of a specific menu item
router.post('/:restaurantId/menus/:menuId/items', authenticate, createMenuItem); // Create a new menu item
router.patch('/:restaurantId/menus/:menuId/items/:itemId', authenticate, updateMenuItem); // Update menu item details
router.delete('/:restaurantId/menus/:menuId/items/:itemId', authenticate, deleteMenuItem); // Delete/Deactivate a menu item

module.exports = router;
