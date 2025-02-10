const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { upload, setUploadType } = require('../config/multerConfig');
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

// Create a new menu item (with image upload)
router.post(
    '/:restaurantId/menus/:menuId/items',
    authenticate,
    setUploadType('menu'),
    upload.single('menuItemImage'),
    createMenuItem
);

// Update menu item details (optionally update image)
router.patch(
    '/:restaurantId/menus/:menuId/items/:itemId',
    authenticate,
    setUploadType('menu'),
    upload.single('menuItemImage'),
    updateMenuItem
);

router.delete('/:restaurantId/menus/:menuId/items/:itemId', authenticate, deleteMenuItem); // Delete/Deactivate a menu item

module.exports = router;
