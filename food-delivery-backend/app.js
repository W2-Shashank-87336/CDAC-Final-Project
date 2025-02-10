const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const menuItemRoutes = require('./src/routes/menuItemRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { conn } = require('./src/config/db');

const app = express();

app.use(cors({ origin: '*' })); // Allows all origins

app.use(express.json());


app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/menus', menuRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/menu/items', menuItemRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/delivery', deliveryRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, 'src/uploads')));


app.listen(3030, () => {
    console.log('Application is running on port 3030');
}); 
