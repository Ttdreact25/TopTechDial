<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Master Audit & Compliance Manager for Platform Governance
 */

class AuditManager {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Conduct a high-level security audit of recently changed business listings
     */
    public function auditListingChanges($limit = 100) {
        $stmt = $this->db->prepare("
            SELECT t.target_id, t.actor_id, t.changes, t.created_at, b.title 
            FROM system_audit_logs t
            JOIN businesses b ON t.target_id = b.id
            WHERE t.event_type = 'LISTING_UPDATE'
            ORDER BY t.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([(int)$limit]);
        return $stmt->fetchAll();
    }

    /**
     * Identify users with suspicious account activity (failed logins, rapid searches)
     */
    public function getFlaggedAccounts() {
        $stmt = $this->db->query("
            SELECT id, name, email, account_status, 
            (SELECT COUNT(*) FROM search_logs WHERE user_id = users.id AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)) as hourly_searches
            FROM users 
            WHERE account_status != 'active' OR id IN (
                SELECT user_id FROM search_logs GROUP BY user_id HAVING COUNT(*) > 500
            )
        ");
        return $stmt->fetchAll();
    }

    /**
     * Reset security flags for a specific user after review
     */
    public function resolveUserFlags($userId, $adminId) {
        $stmt = $this->db->prepare("UPDATE users SET account_status = 'active' WHERE id = ?");
        $stmt->execute([$userId]);
        
        // Log the resolution
        $stmt = $this->db->prepare("INSERT INTO system_audit_logs (event_type, target_id, actor_id, details) VALUES ('SECURITY_RESOLVE', ?, ?, 'Admin cleared account flags')");
        $stmt->execute([$userId, $adminId]);
    }
}
?>
