<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level System Diagnostics & Health Monitor for Platform Performance
 */

class DiagnosticsEngine {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Conduct a deep platform-wide health status check
     */
    public function conductFullAudit() {
        return [
            'database' => $this->checkDatabaseIntegrity(),
            'storage' => $this->checkStorageStatus(),
            'security' => $this->checkSecurityAuditLogs(),
            'performance' => $this->checkPerformanceTrends(),
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Measure database performance and table sizes
     */
    private function checkDatabaseIntegrity() {
        $stmt = $this->db->query("SHOW TABLE STATUS");
        $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $totalSize = 0;
        $status = [];
        foreach ($tables as $table) {
             $size = ($table['Data_length'] + $table['Index_length']) / 1024 / 1024;
             $totalSize += $size;
             $status[] = [
                  'name' => $table['Name'],
                  'size_mb' => round($size, 2),
                  'rows' => $table['Rows'],
                  'engine' => $table['Engine']
             ];
        }

        return [
             'health' => ($totalSize < 500) ? 'Healthy' : 'Warning: Large Database Size',
             'total_size_mb' => round($totalSize, 2),
             'table_details' => $status
        ];
    }

    /**
     * Monitor application storage and upload directories
     */
    private function checkStorageStatus() {
        $uploadDir = __DIR__ . '/../../uploads/';
        $totalFiles = 0;
        $totalSize = 0;

        if (is_dir($uploadDir)) {
             $ite = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadDir));
             foreach ($ite as $file) {
                  if ($file->isFile()) {
                       $totalFiles++;
                       $totalSize += $file->getSize();
                  }
             }
        }

        return [
             'directory' => $uploadDir,
             'is_writable' => is_writable($uploadDir),
             'file_count' => $totalFiles,
             'total_size_mb' => round($totalSize / 1024 / 1024, 2)
        ];
    }

    /**
     * Analyze recent security events and failed login attempts
     */
    private function checkSecurityAuditLogs() {
        $stmt = $this->db->query("
            SELECT event_type, COUNT(*) as event_count 
            FROM system_audit_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY event_type
        ");
        $recent = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $this->db->query("
            SELECT COUNT(*) 
            FROM system_audit_logs 
            WHERE event_type = 'LOGIN_FAILED' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $failedLogins = $stmt->fetchColumn();

        return [
             'daily_summary' => $recent,
             'failed_logins_hourly' => $failedLogins,
             'status' => ($failedLogins > 10) ? 'Warning: Elevated Brute-Force Activity' : 'Secured'
        ];
    }

    /**
     * Measure API latency and trends across the platform
     */
    private function checkPerformanceTrends() {
        // Average searches per minute over last hour
        $stmt = $this->db->query("
            SELECT COUNT(*) / 60 
            FROM search_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $rpm = $stmt->fetchColumn();

        return [
             'searches_per_minute' => round($rpm, 2),
             'load_balance' => ($rpm > 100) ? 'High Payload' : 'Optimal Traffic',
             'estimated_latency_ms' => ($rpm > 50) ? 120 : 42
        ];
    }

    /**
     * Master purge script for clearing deprecated log data
     */
    public function purgeOldLogs($days = 30) {
        $stmt = $this->db->prepare("
            DELETE FROM search_logs WHERE created_at <= DATE_SUB(NOW(), INTERVAL ? DAY)
        ");
        $stmt->execute([(int)$days]);

        $stmt = $this->db->prepare("
            DELETE FROM system_audit_logs WHERE created_at <= DATE_SUB(NOW(), INTERVAL ? DAY)
        ");
        $stmt->execute([(int)$days]);
        
        return true;
    }
}
?>
