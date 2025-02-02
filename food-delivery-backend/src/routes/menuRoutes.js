const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    listMenus,
    getMenu,
    createMenu,
    updateMenu,
    deleteMenu,
} = require('../controllers/menuController');

const router = express.Router();

router.get('/:restaurantId/menus', listMenus); // List all menus for a restaurant
router.get('/:restaurantId/menus/:menuId', getMenu); // Get details of a specific menu
router.post('/:restaurantId/menus', authenticate, createMenu); // Create a new menu
router.patch('/:restaurantId/menus/:menuId', authenticate, updateMenu); // Update menu details
router.delete('/:restaurantId/menus/:menuId', authenticate, deleteMenu); // Deactivate/Delete a menu

module.exports = router;
