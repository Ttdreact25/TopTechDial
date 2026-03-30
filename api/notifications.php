<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Notification Endpoint for User System Alerts
 */

require_once('config.php');
require_once('notifications/NotificationService.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

$notificationService = new NotificationService($conn);

if ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'count') {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0");
        $stmt->execute([$userId]);
        $count = $stmt->fetchColumn();
        sendResponse(true, 'Count retrieved', ['count' => (int)$count]);
    } else {
        $notifications = $notificationService->getMyUnreadNotifications($userId);
        sendResponse(true, 'Notifications retrieved', $notifications);
    }

} elseif ($method == 'PUT') {
    $action = $_GET['action'] ?? null;
    $data = getJsonInput();
    
    if ($action === 'read') {
        $notificationId = $_GET['id'] ?? $data['id'] ?? null;
        if ($notificationId) {
            $notificationService->markAsRead($notificationId, $userId);
            sendResponse(true, 'Notification marked as read');
        } else {
            // Mark all as read
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
            $stmt->execute([$userId]);
            sendResponse(true, 'All notifications marked as read');
        }
    }

} elseif ($method == 'DELETE') {
    $notificationId = $_GET['id'] ?? null;
    if ($notificationId) {
        $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?");
        $stmt->execute([$notificationId, $userId]);
        sendResponse(true, 'Notification deleted');
    }
}
?>
