
-- Create Database
CREATE DATABASE IF NOT EXISTS food_delivery_db;

-- Use Database
USE food_delivery_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER', 'SUPER_ADMIN') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    addressLine1 VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ownerId INT,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

-- Menus Table
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurantId INT,
    menuName VARCHAR(100) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menuId INT,
    restaurantId INT,
    itemName VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (menuId) REFERENCES menus(id),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT,
    restaurantId INT,
    addressId INT,
    couponId INT,
    paymentMethod ENUM('CREDIT_CARD', 'DEBIT_CARD', 'COD') NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') DEFAULT 'PENDING',
    rejectionReason TEXT,
    FOREIGN KEY (customerId) REFERENCES users(id),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    itemId INT,
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (itemId) REFERENCES menu_items(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    amount DECIMAL(10, 2),
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    FOREIGN KEY (orderId) REFERENCES orders(id)
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurantId INT,
    code VARCHAR(50) NOT NULL UNIQUE,
    discountType ENUM('PERCENTAGE', 'FLAT') NOT NULL,
    discountValue DECIMAL(10, 2),
    validFrom DATETIME,
    validTo DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    addressLine1 VARCHAR(255),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    customerId INT,
    restaurantId INT,
    deliveryPartnerId INT,
    restaurantRating INT,
    deliveryRating INT,
    comment TEXT,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (customerId) REFERENCES users(id),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
    FOREIGN KEY (deliveryPartnerId) REFERENCES users(id)
);

-- Dummy Data
-- Insert Users
INSERT INTO users (fullName, email, phone, password, role) VALUES
('John Doe', 'john@example.com', '1234567890', 'password', 'CUSTOMER'),
('Jane Smith', 'jane@example.com', '0987654321', 'password', 'RESTAURANT_OWNER'),
('Bob Rider', 'bob@example.com', '1112223333', 'password', 'DELIVERY_PARTNER'),
('Admin User', 'admin@example.com', '4445556666', 'password', 'SUPER_ADMIN');

-- Insert Restaurants
INSERT INTO restaurants (name, description, addressLine1, latitude, longitude, ownerId) VALUES
('Pasta Palace', 'Italian Restaurant', '123 Pasta Lane', 40.712776, -74.005974, 2),
('Burger Barn', 'Best Burgers in Town', '456 Burger Blvd', 40.730610, -73.935242, 2);

-- Insert Menus
INSERT INTO menus (restaurantId, menuName) VALUES
(1, 'Dinner Menu'),
(2, 'Lunch Specials');

-- Insert Menu Items
INSERT INTO menu_items (menuId, restaurantId, itemName, description, price) VALUES
(1, 1, 'Spaghetti Carbonara', 'Classic Italian pasta with creamy sauce', 12.99),
(1, 1, 'Margherita Pizza', 'Wood-fired pizza with fresh mozzarella and basil', 10.99),
(2, 2, 'Cheeseburger', 'Juicy burger with cheddar cheese', 8.99),
(2, 2, 'Chicken Sandwich', 'Grilled chicken sandwich with lettuce and tomato', 9.49);

-- Insert Coupons
INSERT INTO coupons (restaurantId, code, discountType, discountValue, validFrom, validTo) VALUES
(1, 'PASTA10', 'PERCENTAGE', 10.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
(2, 'BURGER5', 'FLAT', 5.00, '2025-01-01 00:00:00', '2025-06-30 23:59:59');
