const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { upload, setUploadType } = require('../config/multerConfig');
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
router.post('/:restaurantId/menus', authenticate, setUploadType('menu'), upload.single('menuImage'), createMenu); // Create menu with image
router.patch('/:restaurantId/menus/:menuId', authenticate, setUploadType('menu'), upload.single('menuImage'), updateMenu); // Update menu details
router.delete('/:restaurantId/menus/:menuId', authenticate, deleteMenu); // Deactivate/Delete a menu

module.exports = router;
