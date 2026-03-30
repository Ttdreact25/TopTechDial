<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * System Maintenance & Health Checking Script
 */

require_once('config.php');
require_once('enterprise/DbMigrationManager.php');

$method = $_SERVER['REQUEST_METHOD'];

// Maintenance mode check (Simple simulated toggle)
$isMaintenance = false; // Set to true to block API requests

if ($isMaintenance) {
    sendResponse(false, 'System is currently under scheduled maintenance. We will be back online shortly.', null, 503);
}

if ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    $password = $_GET['p'] ?? '';

    // Specialized maintenance tasks requiring specific token/password
    if ($password !== 'TTD-ADMIN-SYNC-2024') {
        sendResponse(false, 'Forbidden: Maintenance credentials required.', null, 403);
    }

    $dbManager = new DbMigrationManager($conn);

    if ($action === 'health-check') {
        $status = [
            'database' => $conn ? 'connected' : 'failed',
            'storage_read' => is_readable(__DIR__ . '/uploads') ? 'ok' : 'locked',
            'storage_write' => is_writable(__DIR__ . '/uploads') ? 'ok' : 'locked',
            'php_version' => PHP_VERSION,
            'server_load' => function_exists('sys_getloadavg') ? sys_getloadavg()[0] : 'N/A',
            'time' => date('Y-m-d H:i:s')
        ];
        sendResponse(true, 'System health report generated', $status);

    } elseif ($action === 'cleanup-cache') {
        $cacheDir = __DIR__ . '/../tmp/cache/';
        if (is_dir($cacheDir)) {
            $files = glob($cacheDir . '*');
            foreach ($files as $file) {
                if (is_file($file)) unlink($file);
            }
            sendResponse(true, 'Cache directory sanitized successfully');
        } else {
            sendResponse(false, 'Cache directory not found');
        }

    } elseif ($action === 'integrity-fix') {
        $repairCount = $dbManager->runDataAudit()['orphaned_repaired'];
        sendResponse(true, 'Database relational integrity repaired', ['repaired' => $repairCount]);
    }

} else {
    sendResponse(false, 'Method not allowed for maintenance routine', null, 405);
}
?>
