-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 05:39 PM
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
-- Table structure for table `dispatches`
--

CREATE TABLE `dispatches` (
  `id` int(11) NOT NULL,
  `sell_bill_no` varchar(100) DEFAULT NULL,
  `dispatch_date` date DEFAULT NULL,
  `driver_name` varchar(255) DEFAULT NULL,
  `bill_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_items`
--

CREATE TABLE `dispatch_items` (
  `id` int(11) NOT NULL,
  `dispatch_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 4, 1, 'Sindica (Atul)', 1.00, 10, '2026-05-06 12:57:48'),
(2, 2, 4, 'Abacin(crystal) ', 100.00, 5, '2026-05-06 13:03:16'),
(3, 2, 4, 'Abacin(crystal)', 50.00, 10, '2026-05-06 13:04:15'),
(4, 3, 4, 'Merivon (BASF)', 40.00, 5, '2026-05-06 13:05:39'),
(5, 5, 1, '13-40-13 (Mahadhan)', 25.00, 5, '2026-05-09 13:24:47'),
(6, 2, 3, 'Biovita (PI)', 1.00, 10, '2026-05-09 13:25:50'),
(7, 2, 4, 'Biovita (PI)', 500.00, 20, '2026-05-09 13:26:04'),
(8, 4, 2, 'Shempra (Dhanuka)', 3.60, 10, '2026-05-09 13:26:55'),
(9, 4, 2, 'Shempra (Dhanuka)', 18.00, 5, '2026-05-09 13:27:06'),
(10, 3, 2, 'Ridomil gold (Syngenta)', 250.00, 5, '2026-05-09 13:28:04'),
(11, 3, 2, 'Ridomil gold (Syngenta)', 100.00, 5, '2026-05-09 13:28:13'),
(12, 2, 4, 'Rogor (FMC)', 100.00, 10, '2026-05-09 13:28:55'),
(13, 2, 4, 'Rogor (FMC)', 250.00, 2, '2026-05-09 13:29:07'),
(14, 4, 2, 'Triskel (Swal)', 1200.00, 8, '2026-05-09 13:29:42'),
(15, 2, 4, 'Benevia (FMC)', 180.00, 0, '2026-05-09 13:30:37'),
(16, 2, 4, 'Bio-20 (Zuari)', 100.00, 10, '2026-05-09 13:31:15'),
(17, 2, 4, 'Bio-20 (Zuari)', 250.00, 10, '2026-05-09 13:31:20'),
(18, 4, 2, 'Mark (Rallis)', 12.40, 400, '2026-05-09 13:32:02');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_status` varchar(20) DEFAULT 'pending',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `bill_no`, `dc_no`, `vendor_id`, `purchase_date`, `hamali`, `grand_total`, `created_at`, `payment_status`, `notes`) VALUES
(1, '15', '-', 4, '2026-03-24', 10.00, 20185.00, '2026-05-08 09:44:33', 'paid', ' date 14/4/26 paid cash kele '),
(2, '-', '19086', 5, '2026-05-09', 0.00, 237500.00, '2026-05-09 13:39:38', 'pending', 'payment baki ahe ...');

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
(81, 1, 1, NULL, 1.00, 'kg', '1', 10.00, 1220.00, 0.00, 0.00, 0.00, 12200.00),
(82, 1, 2, NULL, 100.00, 'ml', '1', 5.00, 540.00, 0.00, 0.00, 0.00, 2700.00),
(83, 1, 3, NULL, 50.00, 'ml', '1', 10.00, 285.00, 0.00, 0.00, 0.00, 2850.00),
(84, 1, 4, NULL, 40.00, 'ml', '1', 5.00, 485.00, 0.00, 0.00, 0.00, 2425.00),
(153, 2, 5, NULL, 25.00, 'kg', '-', 5.00, 3900.00, 0.00, 0.00, 0.00, 19500.00),
(154, 2, 6, NULL, 1.00, 'Ltr', '-', 10.00, 600.00, 0.00, 0.00, 0.00, 6000.00),
(155, 2, 7, NULL, 500.00, 'ml', '-', 20.00, 315.00, 0.00, 0.00, 0.00, 6300.00),
(156, 2, 8, NULL, 3.60, 'gm', '-', 10.00, 170.00, 0.00, 0.00, 0.00, 1700.00),
(157, 2, 9, NULL, 18.00, 'gm', '-', 5.00, 750.00, 0.00, 0.00, 0.00, 3750.00),
(158, 2, 10, NULL, 250.00, 'gm', '-', 5.00, 400.00, 0.00, 0.00, 0.00, 2000.00),
(159, 2, 11, NULL, 100.00, 'gm', '-', 5.00, 180.00, 0.00, 0.00, 0.00, 900.00),
(160, 2, 12, NULL, 100.00, 'ml', '-', 10.00, 90.00, 0.00, 0.00, 0.00, 900.00),
(161, 2, 13, NULL, 250.00, 'ml', '-', 2.00, 200.00, 0.00, 0.00, 0.00, 400.00),
(162, 2, 14, NULL, 1200.00, 'gm', '-', 8.00, 1350.00, 0.00, 0.00, 0.00, 10800.00),
(163, 2, 16, NULL, 100.00, 'ml', '-', 10.00, 120.00, 0.00, 0.00, 0.00, 1200.00),
(164, 2, 17, NULL, 250.00, 'ml', '-', 10.00, 300.00, 0.00, 0.00, 0.00, 3000.00),
(165, 2, 18, NULL, 12.40, 'gm', '-', 400.00, 440.00, 0.00, 0.00, 0.00, 176000.00),
(166, 2, 15, NULL, 180.00, 'ml', '-', 5.00, 1010.00, 0.00, 0.00, 0.00, 5050.00);

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
  `gst_no` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `mobile`, `address`, `gst_no`, `created_at`) VALUES
(1, 'fgh', NULL, NULL, NULL, '2026-05-05 11:20:07'),
(2, 'suraj pawar', NULL, NULL, NULL, '2026-05-05 11:41:19'),
(3, 'abhi hoke', NULL, NULL, NULL, '2026-05-06 12:00:25'),
(4, 'Tulsi Beej Bhandar, Jalna', NULL, NULL, NULL, '2026-05-06 13:10:54'),
(5, 'Raja Harishchandra KSK, Devdi', '8805442424', 'Devdi Tq. Wadvani Dist. Beed', 'CEV67765454345FH52K', '2026-05-09 13:39:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dispatches`
--
ALTER TABLE `dispatches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dispatch_items`
--
ALTER TABLE `dispatch_items`
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
-- AUTO_INCREMENT for table `dispatches`
--
ALTER TABLE `dispatches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_items`
--
ALTER TABLE `dispatch_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
