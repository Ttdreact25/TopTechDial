<?php
require_once('config.php');

header('Content-Type: application/json; charset=UTF-8');

try {
    // Check if category column exists
    $stmt = $conn->prepare("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'category'");
    $stmt->execute();
    $result = $stmt->fetch();
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Category column exists', 'column_exists' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Category column is MISSING', 'column_exists' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
