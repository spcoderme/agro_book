-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2026 at 02:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agro_book_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name_marathi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `name_marathi`) VALUES
(1, 'Rodenticide', '2026-04-25 12:09:56', 'उंदीरनाशक'),
(2, 'Insecticide', '2026-04-25 12:09:56', 'कीटकनाशक'),
(3, 'Fungicide', '2026-04-25 12:09:56', 'बुरशीनाशक'),
(4, 'Herbicide', '2026-04-25 12:09:56', 'तणनाशक'),
(5, 'Fertilizers', '2026-04-25 12:09:56', 'खते'),
(6, 'Seeds', '2026-04-25 12:09:56', 'बियाणे');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `unit_value` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `unit_id`, `name`, `unit_value`, `stock`, `created_at`) VALUES
(1, 5, 2, 'Imax', 250.00, 12, '2026-04-25 12:55:14'),
(2, 3, 3, 'SDS', 250.00, 63, '2026-04-25 13:03:18'),
(3, 5, 1, '10/26/26', 50.00, 350, '2026-04-25 13:11:12'),
(4, 5, 1, '10/26/26 (Mahadhan)', 50.00, 200, '2026-04-25 13:11:52'),
(5, 5, 1, '10/26/26 (Gromar)', 50.00, 350, '2026-04-25 13:12:11'),
(6, 2, 4, 'Vijeta 505(Khandelwal)', 500.00, 102, '2026-04-25 13:13:33'),
(7, 5, 1, '20-20-0-13(Gromar)', 50.00, 468, '2026-04-25 13:18:00'),
(8, 4, 2, 'Imax', 250.00, 35, '2026-04-25 13:28:38');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `bill_no` varchar(50) DEFAULT NULL,
  `dc_no` varchar(50) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `hamali` decimal(10,2) DEFAULT NULL,
  `grand_total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `bill_no`, `dc_no`, `vendor_id`, `purchase_date`, `hamali`, `grand_total`, `created_at`) VALUES
(1, '', '1325', 0, '2026-04-25', NULL, 66380.00, '2026-04-26 11:21:53'),
(2, '159', '', 0, '2026-04-22', NULL, 348840.00, '2026-04-26 11:27:01'),
(3, '', '', 0, '0000-00-00', NULL, 0.00, '2026-05-05 11:10:11'),
(4, 'hghg', 'fgh', 0, '2026-05-04', NULL, 3109.05, '2026-05-05 11:12:44'),
(5, 'hghg', 'fgh', 1, '2026-05-04', NULL, 3109.00, '2026-05-05 11:20:07'),
(6, 'hiikdk1231', '21221', 2, '2026-11-23', NULL, 21257.00, '2026-05-05 11:41:19'),
(7, 'jkjk', 'hjk', 2, '2025-11-23', NULL, 8481.00, '2026-05-05 12:05:55');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `unit_value` decimal(10,2) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `batch_no` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `tax_percent` decimal(5,2) DEFAULT NULL,
  `cgst` decimal(10,2) DEFAULT NULL,
  `sgst` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_id`, `company_name`, `unit_value`, `unit`, `batch_no`, `quantity`, `rate`, `tax_percent`, `cgst`, `sgst`, `total`) VALUES
(1, 5, 6, NULL, NULL, NULL, '24', 2.00, 457.00, 5.00, NULL, NULL, NULL),
(2, 5, 8, NULL, NULL, '', '4', 23.00, 24.00, 5.00, NULL, NULL, NULL),
(3, 5, 3, NULL, NULL, '', '12', 65.00, 23.00, 5.00, NULL, NULL, NULL),
(4, 6, 2, NULL, NULL, NULL, 'klkl', 13.00, 452.00, 5.00, NULL, NULL, NULL),
(5, 6, 5, NULL, NULL, '', '45', 96.00, 85.00, 5.00, NULL, NULL, NULL),
(6, 6, 3, NULL, NULL, '', '36', 85.00, 65.00, 18.00, NULL, NULL, NULL),
(7, 7, 7, NULL, NULL, NULL, '54', 54.00, 45.00, 5.00, NULL, NULL, NULL),
(8, 7, 7, NULL, NULL, '', '44', 54.00, 54.00, 5.00, NULL, NULL, NULL),
(9, 7, 5, NULL, NULL, '', '454', 54.00, 45.00, 18.00, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stock_transactions`
--

CREATE TABLE `stock_transactions` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `type` enum('IN','OUT') DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `short_name` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `short_name`) VALUES
(1, 'Kilogram', 'kg'),
(2, 'Gram', 'gm'),
(3, 'Litre', 'Ltr'),
(4, 'Millilitre', 'ml'),
(5, 'Packet', 'pkt');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `mobile`, `address`, `created_at`) VALUES
(1, 'fgh', NULL, NULL, '2026-05-05 11:20:07'),
(2, 'suraj pawar', NULL, NULL, '2026-05-05 11:41:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_transactions`
--
ALTER TABLE `stock_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `stock_transactions`
--
ALTER TABLE `stock_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `stock_transactions`
--
ALTER TABLE `stock_transactions`
  ADD CONSTRAINT `stock_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
