<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $userId = verifyToken();
    
    $stmt = $conn->prepare("SELECT id as _id, name, email, phone, role, avatar, category FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, 'User not found', null, 404);
    }
    
    // Fetch Saved Items
    $stmt = $conn->prepare("SELECT business_id FROM saved_items WHERE user_id = ?");
    $stmt->execute([$userId]);
    $user['savedItems'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Fetch Favorite Items
    $stmt = $conn->prepare("SELECT business_id FROM favorite_items WHERE user_id = ?");
    $stmt->execute([$userId]);
    $user['favoriteItems'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
    // Normalize category into categories array for clients/admins
    $rawCat = $user['category'] ?? null;
    $categories = [];
    if ($rawCat !== null && $rawCat !== '') {
        $trim = trim($rawCat);
        if (strlen($trim) > 0 && $trim[0] === '[') {
            $decoded = json_decode($rawCat, true);
            if (is_array($decoded)) $categories = $decoded;
        } else {
            $categories = [$rawCat];
        }
    }
    $user['categories'] = $categories;

    sendResponse(true, 'User retrieved', $user, 200);
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
