<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Security & Access Auditor for Data Integrity
 */

class SecurityAuditor {
    private $db;
    private $auditLogFile;

    public function __construct($db) {
        $this->db = $db;
        $this->auditLogFile = __DIR__ . '/../../tmp/security_audit.log';
    }

    /**
     * Audit every authentication attempt
     */
    public function logAuthAttempt($userId, $ipAddress, $status, $failureReason = null) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = json_encode([
            'timestamp' => $timestamp,
            'user_id' => $userId,
            'ip' => $ipAddress,
            'status' => $status,
            'reason' => $failureReason,
            'ua' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ]);

        file_put_contents($this->auditLogFile, $logEntry . PHP_EOL, FILE_APPEND);
    }

    /**
     * Detect suspicious activity like rapid-fire searches
     */
    public function checkSearchRateLimit($userId, $ipAddress) {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) FROM search_logs 
            WHERE (user_id = ? OR user_ip = ?) 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)
        ");
        $stmt->execute([$userId, $ipAddress]);
        $count = $stmt->fetchColumn();

        if ($count > 30) { // Limit to 30 searches per minute
            $this->logAuthAttempt($userId, $ipAddress, 'BLOCKED', 'Rate limit exceeded');
            return false;
        }
        
        return true;
    }

    /**
     * Audit listing changes for tracking potential tampering
     */
    public function auditListingUpdate($businessId, $editorId, $originalData, $newData) {
        $changes = [];
        foreach ($newData as $field => $value) {
            if (isset($originalData[$field]) && $originalData[$field] !== $value) {
                $changes[$field] = [
                    'old' => $originalData[$field],
                    'new' => $value
                ];
            }
        }

        if (!empty($changes)) {
            $stmt = $this->db->prepare("
                INSERT INTO system_audit_logs (event_type, target_id, actor_id, changes)
                VALUES ('LISTING_UPDATE', ?, ?, ?)
            ");
            $stmt->execute([$businessId, $editorId, json_encode($changes)]);
        }
    }

    /**
     * Sanitization logic for critical business data
     */
    public function sanitizeInput($data) {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->sanitizeInput($value);
            }
        } else {
            $data = trim($data);
            $data = strip_tags($data);
            $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }
        return $data;
    }

    /**
     * Check if a specific file path is safe to read/write
     */
    public function isSafePath($path) {
        $realPath = realpath($path);
        $baseDir = realpath(__DIR__ . '/../../');
        
        return strpos($realPath, $baseDir) === 0;
    }
}
?>
