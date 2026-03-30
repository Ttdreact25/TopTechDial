<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Audit Logger for sensitive platform operations
 */

class AuditLogger {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Log a sensitive activity within the system
     */
    public function logActivity($userId, $activityType, $details = []) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        
        $stmt = $this->db->prepare("
            INSERT INTO system_audit_logs (user_id, activity_type, details, ip_address, created_at)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $jsonDetails = json_encode($details);
        $stmt->execute([$userId, $activityType, $jsonDetails, $ip, $timestamp]);
        
        return $this->db->lastInsertId();
    }

    /**
     * Retrieve audit history for a specific user
     */
    public function getUserHistory($userId, $limit = 50) {
        $stmt = $this->db->prepare("
            SELECT * FROM system_audit_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ");
        $stmt->execute([$userId, (int)$limit]);
        return $stmt->fetchAll();
    }

    /**
     * Specialized logging for failed login attempts (Security)
     */
    public function logFailedLogin($email, $reason) {
        $this->logActivity(0, 'LOGIN_FAILURE', [
            'email_attempted' => $email,
            'reason' => $reason
        ]);
    }

    /**
     * Log whenever a business listing is created or deleted
     */
    public function logListingManagement($userId, $listingId, $action) {
        $this->logActivity($userId, 'LISTING_MGMT', [
            'listing_id' => $listingId,
            'action' => $action
        ]);
    }

    /**
     * Admin specialized logging for user role modifications
     */
    public function logUserRoleChange($adminId, $targetUserId, $oldRole, $newRole) {
        $this->logActivity($adminId, 'ROLE_CHANGE', [
            'target_user_id' => $targetUserId,
            'old_role' => $oldRole,
            'new_role' => $newRole
        ]);
    }
}
?>
