-- Create Database
CREATE DATABASE IF NOT EXISTS toptechdial;
USE toptechdial;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'business_owner', 'staff', 'client') DEFAULT 'user',
    category VARCHAR(255) DEFAULT NULL,
    otp VARCHAR(10) DEFAULT NULL,
    otp_expiry DATETIME DEFAULT NULL,
    reset_password_otp VARCHAR(10) DEFAULT NULL,
    reset_password_otp_expiry DATETIME DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    lat DECIMAL(10, 8) DEFAULT 0,
    lng DECIMAL(11, 8) DEFAULT 0,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    whatsapp VARCHAR(20),
    images TEXT, -- JSON string of image URLs
    open_time TIME DEFAULT '09:00:00',
    close_time TIME DEFAULT '21:00:00',
    average_rating FLOAT DEFAULT 0,
    review_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT,
    status ENUM('pending', 'approved', 'rejected', 'responded', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Saved Items Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS saved_items (
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    PRIMARY KEY (user_id, business_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Favorite Items Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS favorite_items (
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    PRIMARY KEY (user_id, business_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Search Logs Table
CREATE TABLE IF NOT EXISTS search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search_query VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    city VARCHAR(100),
    user_ip VARCHAR(45),
    lat DECIMAL(10,7) DEFAULT NULL,
    lng DECIMAL(10,7) DEFAULT NULL,
    intent VARCHAR(100) DEFAULT NULL,
    user_id INT, -- Optional, if logged in
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads (delivered to businesses when customers request services)
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_request_id INT DEFAULT NULL,
    business_id INT NOT NULL,
    customer_id INT DEFAULT NULL,
    customer_name VARCHAR(255) DEFAULT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    customer_phone VARCHAR(30) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending','delivered','failed') DEFAULT 'pending',
    price DECIMAL(10,2) DEFAULT 0.00,
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Owner Credits (prepaid credits for purchasing leads)
CREATE TABLE IF NOT EXISTS owner_credits (
    owner_id INT PRIMARY KEY,
    credits INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments / Purchases (records of credit purchases)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    credits_purchased INT DEFAULT 0,
    provider VARCHAR(100) DEFAULT 'mock',
    provider_ref VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add category column to users table if it doesn't exist (for existing databases)
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname = 'category';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE 
    (TABLE_NAME = @tablename) AND (TABLE_SCHEMA = @dbname) AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(255) DEFAULT NULL")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
