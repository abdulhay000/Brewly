CREATE DATABASE IF NOT EXISTS brewly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brewly_db;

CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 username VARCHAR(100) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('user','admin') NOT NULL DEFAULT 'user',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 has_used_discount BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS categories (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE,
 description TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
 id INT AUTO_INCREMENT PRIMARY KEY,
 category_id INT NOT NULL,
 name VARCHAR(150) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 image_url VARCHAR(500),
 description TEXT,
 available BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_product_category_name (category_id, name),
 FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS orders (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 customer_name VARCHAR(150) NOT NULL,
 phone VARCHAR(40) NOT NULL,
 address VARCHAR(500) NOT NULL,
 notes TEXT,
 subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
 discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
 total DECIMAL(10,2) NOT NULL,
 payment_method ENUM('cash','chapa','telebirr','cbe_birr') NOT NULL DEFAULT 'cash',
 payment_status ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
 order_status ENUM('pending','confirmed','preparing','ready','delivered','cancelled') NOT NULL DEFAULT 'pending',
 payment_reference VARCHAR(255),
 payment_checkout_url VARCHAR(1000),
 paid_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 order_id INT NOT NULL,
 product_id INT NULL,
 product_name VARCHAR(150) NOT NULL,
 unit_price DECIMAL(10,2) NOT NULL,
 quantity INT NOT NULL,
 FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(150) NOT NULL,
 email VARCHAR(255) NOT NULL,
 message TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
