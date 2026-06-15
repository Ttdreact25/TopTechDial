<?php
require_once('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT DISTINCT city FROM businesses WHERE is_approved = 1 AND city != '' ORDER BY city ASC");
    $stmt->execute();
    $cities = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    sendResponse(true, 'Cities retrieved', $cities);
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
