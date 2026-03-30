<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Database Schema Manager & Lifecycle Optimizer
 */

class DbMigrationManager {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Run all required schema migrations for existing projects
     */
    public function migrate() {
        $tables = [
            'users' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'name VARCHAR(255) NOT NULL',
                'email VARCHAR(255) UNIQUE NOT NULL',
                'phone VARCHAR(20)',
                'password VARCHAR(255) NOT NULL',
                'role ENUM("user", "staff", "business_owner") DEFAULT "user"',
                'avatar VARCHAR(255)',
                'account_status ENUM("active", "flagged", "banned") DEFAULT "active"',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'businesses' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'owner_id INT NOT NULL',
                'title VARCHAR(255) NOT NULL',
                'description TEXT',
                'category VARCHAR(100)',
                'street VARCHAR(255)',
                'city VARCHAR(100)',
                'state VARCHAR(100)',
                'zip VARCHAR(20)',
                'phone VARCHAR(20)',
                'email VARCHAR(255)',
                'website VARCHAR(255)',
                'whatsapp VARCHAR(20)',
                'images JSON',
                'open_time TIME',
                'close_time TIME',
                'lat DECIMAL(10,8)',
                'lng DECIMAL(11,8)',
                'is_approved BOOLEAN DEFAULT FALSE',
                'views INT DEFAULT 0',
                'average_rating DECIMAL(3,2) DEFAULT 0',
                'review_count INT DEFAULT 0',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'categories' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'name VARCHAR(100) UNIQUE NOT NULL'
            ],
            'reviews' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'business_id INT NOT NULL',
                'user_id INT NOT NULL',
                'rating INT CHECK (rating BETWEEN 1 AND 5)',
                'comment TEXT',
                'is_approved BOOLEAN DEFAULT TRUE',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'search_logs' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'user_id INT',
                'query VARCHAR(255)',
                'category VARCHAR(100)',
                'location VARCHAR(100)',
                'user_ip VARCHAR(45)',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'notifications' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'user_id INT NOT NULL',
                'title VARCHAR(255)',
                'message TEXT',
                'type VARCHAR(50)',
                'link VARCHAR(255)',
                'is_read BOOLEAN DEFAULT FALSE',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ],
            'requests' => [
                'id INT AUTO_INCREMENT PRIMARY KEY',
                'business_id INT NOT NULL',
                'sender_id INT NOT NULL',
                'message TEXT',
                'status ENUM("pending", "approved", "rejected") DEFAULT "pending"',
                'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            ]
        ];

        foreach ($tables as $table => $columns) {
            $sql = "CREATE TABLE IF NOT EXISTS $table (" . implode(', ', $columns) . ")";
            $this->db->exec($sql);
        }

        // Add specific indexes for search performance
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_search_query ON businesses(title, category, city)");
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_business_owner ON businesses(owner_id)");
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id)");
        
        return true;
    }

    /**
     * Data integrity check for all relational tables
     */
    public function runDataAudit() {
        // Orphaned Businesses (Owned by non-existent users)
        $stmt = $this->db->query("
            SELECT b.id, b.title FROM businesses b 
            LEFT JOIN users u ON b.owner_id = u.id 
            WHERE u.id IS NULL
        ");
        $orphanedBusinesses = $stmt->fetchAll();

        // Self-correct orphaned businesses if they exist
        foreach ($orphanedBusinesses as $ob) {
            // Re-assign to platform owner (Assumed Admin ID 1)
            $this->db->exec("UPDATE businesses SET owner_id = 1 WHERE id = " . $ob['id']);
        }

        return ['orphaned_repaired' => count($orphanedBusinesses)];
    }

    /**
     * Automated Table Optimization logic (VACUUM analog for MySQL)
     */
    public function optimizeStorage() {
        $stmt = $this->db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($tables as $table) {
            $this->db->exec("OPTIMIZE TABLE $table");
        }
        
        return true;
    }
}
?>
