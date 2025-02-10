-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 10, 2025 at 06:34 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food_delivery_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `addressLine1` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `userId`, `addressLine1`, `city`, `latitude`, `longitude`) VALUES
(1, 12, 'BLuemont Stay PG', 'Pune', 37.42199830, -122.08400000),
(2, 12, 'BLuemont Stay PG', 'Pune', 37.42199830, -122.08400000),
(3, 5, 'Bluemont Stay PG, Near Laxmi Chowk', 'Pune', 37.42199830, -122.08400000),
(4, 16, 'Bluemont Stay PG', 'Pune', 18.59977330, 73.73463500),
(5, 17, 'Bluemont Stay', 'Pune', 18.59977330, 73.73463500);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `discountType` enum('PERCENTAGE','FLAT') NOT NULL,
  `discountValue` decimal(10,2) DEFAULT NULL,
  `validFrom` datetime DEFAULT NULL,
  `validTo` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `restaurantId`, `code`, `discountType`, `discountValue`, `validFrom`, `validTo`, `isActive`) VALUES
(1, 1, 'PASTA10', 'PERCENTAGE', 10.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1),
(2, 2, 'BURGER5', 'FLAT', 5.00, '2025-01-01 00:00:00', '2025-06-30 23:59:59', 1);

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `menuName` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `restaurantId`, `menuName`, `isActive`, `image`) VALUES
(1, 1, 'Dinner Menu', 1, 'uploads/menuImages/menu12239366.jpg'),
(2, 2, 'Lunch Specials', 1, 'uploads/menuImages/menu12239366.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `menuId` int(11) DEFAULT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `itemName` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `menuId`, `restaurantId`, `itemName`, `description`, `price`, `isActive`, `image`) VALUES
(1, 1, 1, 'Spaghetti Carbonara', 'Classic Italian pasta with creamy sauce', 12.99, 1, 'uploads/menuItemImages/menu-1739119075982-7122393.jpg'),
(2, 1, 1, 'Margherita Pizza', 'Wood-fired pizza with fresh mozzarella and basil', 10.99, 1, 'uploads/menuItemImages/menu-1739119075982-712239366.jpg'),
(3, 2, 2, 'Cheeseburger', 'Juicy burger with cheddar cheese', 8.99, 1, 'uploads/menuItemImages/menu-1739119075982-712239367.jpg'),
(4, 2, 2, 'Chicken Sandwich', 'Grilled chicken sandwich with lettuce and tomato', 9.49, 1, 'uploads/menuItemImages/menu-1739119075982-712239766.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `addressId` int(11) DEFAULT NULL,
  `couponId` int(11) DEFAULT NULL,
  `paymentMethod` enum('CREDIT_CARD','DEBIT_CARD','COD') NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','PREPARING','READY_FOR_PICKUP','OUT_FOR_DELIVERY','DELIVERED','CANCELED') DEFAULT 'PENDING',
  `rejectionReason` text DEFAULT NULL,
  `total` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customerId`, `restaurantId`, `addressId`, `couponId`, `paymentMethod`, `status`, `rejectionReason`, `total`, `created_at`) VALUES
(1, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 100, '2025-02-09 09:54:23'),
(2, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 9.49, '2025-02-09 12:23:16'),
(3, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 9.49, '2025-02-09 12:24:24'),
(4, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 8.99, '2025-02-09 12:25:42'),
(5, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 18.48, '2025-02-09 12:26:08'),
(6, 5, 2, 3, NULL, 'COD', 'PENDING', NULL, 18.48, '2025-02-09 12:28:58'),
(7, 16, 2, 4, NULL, 'COD', 'PENDING', NULL, 8.99, '2025-02-09 20:51:17'),
(8, 16, 1, 4, NULL, 'COD', 'PENDING', NULL, 12.99, '2025-02-09 22:49:19'),
(9, 17, 2, 5, NULL, 'COD', 'PENDING', NULL, 18.48, '2025-02-10 09:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `itemId`, `quantity`) VALUES
(1, 1, 3, 1),
(2, 2, 4, 1),
(3, 3, 4, 1),
(4, 4, 3, 1),
(5, 6, 3, 1),
(6, 6, 4, 1),
(7, 7, 3, 1),
(8, 8, 1, 1),
(9, 9, 3, 1),
(10, 9, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `deliveryPartnerId` int(11) DEFAULT NULL,
  `restaurantRating` int(11) DEFAULT NULL,
  `deliveryRating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `addressLine1` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `description`, `addressLine1`, `latitude`, `longitude`, `ownerId`, `isActive`, `image`) VALUES
(1, 'Pasta Palace', 'Italian Restaurant', '123 Pasta Lane', 18.59958700, 73.73492500, 2, 1, NULL),
(2, 'Burger Barn', 'Best Burgers in Town', '456 Burger Blvd', 40.73061000, -73.93524200, 2, 1, 'uploads/restaurantImages/restaurant-1739119075982-712239366.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','RESTAURANT_OWNER','DELIVERY_PARTNER','SUPER_ADMIN') NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `profileImage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `phone`, `password`, `role`, `isActive`, `profileImage`) VALUES
(1, 'John Doe', 'john@example.com', '1234567890', 'password', 'CUSTOMER', 1, NULL),
(2, 'Jane Smith', 'jane@example.com', '0987654321', 'password', 'RESTAURANT_OWNER', 1, NULL),
(3, 'Bob Rider', 'bob@example.com', '1112223333', 'password', 'DELIVERY_PARTNER', 1, NULL),
(4, 'Admin User', 'admin@example.com', '4445556666', 'password', 'SUPER_ADMIN', 1, NULL),
(5, 'shashank', 'test@gmail.com', '9807658900', 'test@123', 'CUSTOMER', 1, NULL),
(7, 'Test', 'test2@gmail.com', '7898989909', 'test@123', 'CUSTOMER', 1, NULL),
(8, 'Test3', 'test3@gmail.com', '8783878990', 'Test@123', 'CUSTOMER', 1, NULL),
(9, 'Testtt', 'test4@gmail.com', '7898999988', 'Test@123', 'CUSTOMER', 1, NULL),
(12, 'Test 1212', 'te43st@gmail.com', '7878789809', 'password', 'CUSTOMER', 1, NULL),
(13, 'Shashank', 'shashank222@gmail.om', '7878656545', 'password', 'CUSTOMER', 1, 'uploads/profileImages/profile-1739112362402-343350686.jpg'),
(14, 'Test5', 'test5@gmail.com', '7878989898', 'password', 'CUSTOMER', 1, 'uploads/profileImages/profile-1739113763007-463325747.jpg'),
(15, 'new User', 'new@gmail.com', '3443787878', 'test@123', 'CUSTOMER', 1, 'uploads/profileImages/profile-1739118816760-352642551.jpg'),
(16, 'new22', 'new22@gmail.com', '878768686', '1234', 'CUSTOMER', 1, 'uploads/profileImages/profile-1739119075982-712239366.jpg'),
(17, 'test4445', 'test444@gmail.com', '9898787889', 'Test@123', 'CUSTOMER', 1, 'uploads/profileImages/profile-1739179924148-476046940.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `restaurantId` (`restaurantId`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurantId` (`restaurantId`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menuId` (`menuId`),
  ADD KEY `restaurantId` (`restaurantId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `restaurantId` (`restaurantId`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `itemId` (`itemId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `restaurantId` (`restaurantId`),
  ADD KEY `deliveryPartnerId` (`deliveryPartnerId`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`menuId`) REFERENCES `menus` (`id`),
  ADD CONSTRAINT `menu_items_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `menu_items` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`),
  ADD CONSTRAINT `ratings_ibfk_4` FOREIGN KEY (`deliveryPartnerId`) REFERENCES `users` (`id`);

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
