<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'business_owner'");
    $stmt->execute();
    $hasOwner = $stmt->fetch()['count'] > 0;
    
    echo json_encode(['hasOwner' => $hasOwner]);
    exit();
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
