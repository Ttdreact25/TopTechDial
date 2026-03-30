<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * System Administration Endpoint for Platform Maintenance
 */

require_once('../config.php');
require_once('../enterprise/ReportGenerator.php');
require_once('../enterprise/DbMigrationManager.php');
require_once('../enterprise/SecurityAuditor.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

// Ensure strictly Admin access
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$userId]);
$userRole = $roleStmt->fetch()['role'];

if ($userRole !== 'business_owner') {
    sendResponse(false, 'Forbidden: Admin access only.', null, 403);
}

$reportGen = new ReportGenerator($conn);
$dbManager = new DbMigrationManager($conn);

if ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'report-listings') {
        $report = $reportGen->generateBusinessInventoryReport();
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $report['filename'] . '"');
        echo $report['data'];
        exit;
    } elseif ($action === 'report-engagement') {
        $days = (int)($_GET['days'] ?? 30);
        $data = $reportGen->generateEngagementReport($days);
        sendResponse(true, 'Engagement report generated', $data);
    } elseif ($action === 'audit-logs') {
        $logs = Logger::getLogs(100);
        sendResponse(true, 'Recently captured system logs', $logs);
    } elseif ($action === 'check-integrity') {
        $integrity = $dbManager->runDataAudit();
        sendResponse(true, 'Data audit completed', $integrity);
    }

} elseif ($method == 'POST') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'run-migration') {
        $dbManager->migrate();
        sendResponse(true, 'Schema synchronization complete');
    } elseif ($action === 'optimize-database') {
        $dbManager->optimizeStorage();
        sendResponse(true, 'Storage optimization successful');
    } elseif ($action === 'clear-logs') {
        Logger::clearLogs();
        sendResponse(true, 'System logs cleared successfully');
    }
}
?>
