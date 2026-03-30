<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'PUT') {
    $action = $_GET['action'] ?? null;
    $data = getJsonInput();
    
    if ($action === 'update') {
        $name = $data['name'] ?? null;
        $phone = $data['phone'] ?? null;
        $avatar = $data['avatar'] ?? null;
        $password = $data['password'] ?? null;
        
        $query = "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar)";
        $params = [$name, $phone, $avatar];
        
        if ($password) {
            $query .= ", password = ?";
            $params[] = password_hash($password, PASSWORD_DEFAULT);
        }
        
        $query .= " WHERE id = ?";
        $params[] = $userId;
        
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        
        sendResponse(true, 'Profile updated successfully');

    } elseif ($action === 'toggle-save') {
        $businessId = $data['businessId'] ?? null;
        
        // Check if exists
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM saved_items WHERE user_id = ? AND business_id = ?");
        $stmt->execute([$userId, $businessId]);
        if ($stmt->fetch()['count'] > 0) {
            $stmt = $conn->prepare("DELETE FROM saved_items WHERE user_id = ? AND business_id = ?");
            $stmt->execute([$userId, $businessId]);
        } else {
            $stmt = $conn->prepare("INSERT INTO saved_items (user_id, business_id) VALUES (?, ?)");
            $stmt->execute([$userId, $businessId]);
        }
        
        // Return updated list
        $stmt = $conn->prepare("SELECT business_id FROM saved_items WHERE user_id = ?");
        $stmt->execute([$userId]);
        $savedItems = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        sendResponse(true, 'Saved items updated', $savedItems);

    } elseif ($action === 'toggle-favorite') {
        $businessId = $data['businessId'] ?? null;
        
        // Check if exists
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM favorite_items WHERE user_id = ? AND business_id = ?");
        $stmt->execute([$userId, $businessId]);
        if ($stmt->fetch()['count'] > 0) {
            $stmt = $conn->prepare("DELETE FROM favorite_items WHERE user_id = ? AND business_id = ?");
            $stmt->execute([$userId, $businessId]);
        } else {
            $stmt = $conn->prepare("INSERT INTO favorite_items (user_id, business_id) VALUES (?, ?)");
            $stmt->execute([$userId, $businessId]);
        }
        
        // Return updated list
        $stmt = $conn->prepare("SELECT business_id FROM favorite_items WHERE user_id = ?");
        $stmt->execute([$userId]);
        $favoriteItems = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        sendResponse(true, 'Favorite items updated', $favoriteItems);
    }
}
?>
