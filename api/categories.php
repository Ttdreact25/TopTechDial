<?php
require_once('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $userId = getUserIdFromToken();
    $isClient = false;
    $clientCategories = [];
    
    if ($userId) {
        $roleStmt = $conn->prepare("SELECT role, category FROM users WHERE id = ?");
        $roleStmt->execute([$userId]);
        $user = $roleStmt->fetch();
        if ($user && $user['role'] === 'client') {
            $isClient = true;
            $clientCategoryRaw = $user['category'] ?? null;
            if ($clientCategoryRaw) {
                $trim = trim($clientCategoryRaw);
                if ($trim && $trim[0] === '[') {
                    $decoded = json_decode($clientCategoryRaw, true);
                    if (is_array($decoded)) $clientCategories = $decoded;
                } else {
                    $clientCategories = [$clientCategoryRaw];
                }
            }
        }
    }

    if ($isClient) {
        if (count($clientCategories) === 0) {
            $categories = [];
        } else {
            $placeholders = implode(',', array_fill(0, count($clientCategories), '?'));
            $stmt = $conn->prepare("SELECT id as _id, id, name, image FROM categories WHERE name IN ($placeholders) ORDER BY name ASC");
            $stmt->execute($clientCategories);
            $categories = $stmt->fetchAll();
        }
    } else {
        $stmt = $conn->prepare("SELECT id as _id, id, name, image FROM categories ORDER BY name ASC");
        $stmt->execute();
        $categories = $stmt->fetchAll();
    }
    
    sendResponse(true, 'Categories retrieved', $categories);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userId = verifyToken();
    $data = getJsonInput();
    
    $name = $data['name'] ?? null;
    $image = $data['image'] ?? null;
    
    if (!$name) {
        sendResponse(false, 'Category name is required', null, 400);
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO categories (name, image) VALUES (?, ?)");
        $stmt->execute([$name, $image]);
        
        $newId = $conn->lastInsertId();
        $newCategory = [
            'id' => $newId,
            '_id' => $newId, // Frontend parity
            'name' => $name,
            'image' => $image
        ];
        
        sendResponse(true, 'Category created', $newCategory, 201);
    } catch (PDOException $e) {
        sendResponse(false, 'Database Error: ' . $e->getMessage(), null, 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $userId = verifyToken();
    $id = $_GET['id'] ?? null;
    $data = getJsonInput();
    $name = $data['name'] ?? null;
    $image = $data['image'] ?? null;
    
    if (!$id || !$name) {
        sendResponse(false, 'Category ID and Name are required', null, 400);
    }
    
    $stmt = $conn->prepare("UPDATE categories SET name = ?, image = ? WHERE id = ?");
    $stmt->execute([$name, $image, $id]);
    
    sendResponse(true, 'Category updated successfully');

} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $userId = verifyToken();
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        sendResponse(false, 'Category ID is required', null, 400);
    }
    
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(true, 'Category deleted successfully');
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
