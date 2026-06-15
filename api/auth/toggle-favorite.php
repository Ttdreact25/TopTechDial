<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $userId = verifyToken();
    $data = getJsonInput();
    
    $businessId = $data['businessId'] ?? null;
    
    if (!$businessId) {
        sendResponse(false, 'Business ID is required', null, 400);
    }
    
    try {
        // Check if already favorited
        $stmt = $conn->prepare("SELECT 1 FROM favorite_items WHERE user_id = ? AND business_id = ?");
        $stmt->execute([$userId, $businessId]);
        
        if ($stmt->fetch()) {
            // Already favorited, so REMOVE IT (Toggle OFF)
            $stmt = $conn->prepare("DELETE FROM favorite_items WHERE user_id = ? AND business_id = ?");
            $stmt->execute([$userId, $businessId]);
            $message = 'Removed from favorites';
        } else {
            // Not favorited, so ADD IT (Toggle ON)
            $stmt = $conn->prepare("INSERT INTO favorite_items (user_id, business_id) VALUES (?, ?)");
            $stmt->execute([$userId, $businessId]);
            $message = 'Added to favorites';
        }
        
        // Fetch full updated arrays for frontend sync parity
        $stmtS = $conn->prepare("SELECT business_id FROM saved_items WHERE user_id = ?");
        $stmtS->execute([$userId]);
        $savedItems = array_map('intval', $stmtS->fetchAll(PDO::FETCH_COLUMN));

        $stmtF = $conn->prepare("SELECT business_id FROM favorite_items WHERE user_id = ?");
        $stmtF->execute([$userId]);
        $favoriteItems = array_map('intval', $stmtF->fetchAll(PDO::FETCH_COLUMN));

        $userData = [
            '_id' => $userId,
            'savedItems' => $savedItems,
            'favoriteItems' => $favoriteItems
        ];
        
        sendResponse(true, $message, $userData, 200);
    } catch (PDOException $e) {
        sendResponse(false, 'Database Error: ' . $e->getMessage(), null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
