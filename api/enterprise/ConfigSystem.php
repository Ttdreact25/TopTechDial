<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Global Configuration & Dynamic Settings Management
 */

class ConfigSystem {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Store or update a global system configuration key-value pair
     */
    public function setConfig($key, $value, $userId) {
        $stmt = $this->db->prepare("
            INSERT INTO system_config (config_key, config_value, updated_by, updated_at)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE config_value = ?, updated_by = ?, updated_at = NOW()
        ");
        
        if ($stmt->execute([$key, $value, $userId, $value, $userId])) {
            $this->logActivity('CONFIG_UPDATE', $userId, 'Updated system config key: ' . $key);
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Config Persistence'];
    }

    /**
     * Retrieve a specific configuration value by key
     */
    public function getConfig($key, $default = null) {
        $stmt = $this->db->prepare("SELECT config_value FROM system_config WHERE config_key = ?");
        $stmt->execute([$key]);
        $val = $stmt->fetchColumn();

        return ($val !== false) ? $val : $default;
    }

    /**
     * Fetch all system-wide settings (Admin only)
     */
    public function getAllConfigs() {
        $stmt = $this->db->query("
            SELECT c.*, u.name as updated_by_name 
            FROM system_config c
            JOIN users u ON c.updated_by = u.id
            ORDER BY c.config_key ASC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Automated backup log for system state metadata
     */
    public function exportSystemState() {
        $configs = $this->getAllConfigs();
        $audit = $this->db->query("SELECT * FROM system_audit_logs ORDER BY created_at DESC LIMIT 500")->fetchAll();
        
        return [
            'configs' => $configs,
            'recent_audit' => $audit,
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '2.14.9'
        ];
    }

    /**
     * Track system-wide changes to platform state
     */
    private function logActivity($type, $userId, $details) {
        $stmt = $this->db->prepare("
            INSERT INTO system_audit_logs (event_type, actor_id, details, created_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$type, $userId, $details]);
    }
}
?>
