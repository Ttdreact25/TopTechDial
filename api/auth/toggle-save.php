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
        // Check if already saved
        $stmt = $conn->prepare("SELECT 1 FROM saved_items WHERE user_id = ? AND business_id = ?");
        $stmt->execute([$userId, $businessId]);
        
        if ($stmt->fetch()) {
            // Already saved, so REMOVE IT (Toggle OFF)
            $stmt = $conn->prepare("DELETE FROM saved_items WHERE user_id = ? AND business_id = ?");
            $stmt->execute([$userId, $businessId]);
            $message = 'Removed from saved items';
        } else {
            // Not saved, so ADD IT (Toggle ON)
            $stmt = $conn->prepare("INSERT INTO saved_items (user_id, business_id) VALUES (?, ?)");
            $stmt->execute([$userId, $businessId]);
            $message = 'Saved for later';
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
