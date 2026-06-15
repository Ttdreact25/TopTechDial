<?php
require_once('config.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $businessId = $_GET['businessId'] ?? null;
    if (!$businessId) {
        sendResponse(false, 'Business ID is required', null, 400);
    }
    
    $stmt = $conn->prepare("SELECT 
                                r.id as _id, 
                                r.user_id as userId, 
                                r.business_id as businessId, 
                                r.rating, 
                                r.comment, 
                                r.created_at as createdAt,
                                u.name as userName, 
                                u.avatar as userAvatar 
                          FROM reviews r 
                          JOIN users u ON r.user_id = u.id 
                          WHERE r.business_id = ? 
                          ORDER BY r.created_at DESC");
    $stmt->execute([$businessId]);
    $reviews = $stmt->fetchAll();
    
    sendResponse(true, 'Reviews retrieved', $reviews);

} elseif ($method == 'POST') {
    $userId = verifyToken();
    $data = getJsonInput();
    
    $businessId = $data['businessId'] ?? null;
    $rating = $data['rating'] ?? null;
    $comment = $data['comment'] ?? '';
    
    if (!$businessId || !$rating) {
        sendResponse(false, 'Business ID and rating are required', null, 400);
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO reviews (user_id, business_id, rating, comment) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $businessId, $rating, $comment]);
        
        // Update business rating
        $stmt = $conn->prepare("UPDATE businesses SET 
            average_rating = (SELECT AVG(rating) FROM reviews WHERE business_id = ?),
            review_count = (SELECT COUNT(*) FROM reviews WHERE business_id = ?)
            WHERE id = ?");
        $stmt->execute([$businessId, $businessId, $businessId]);
        
        sendResponse(true, 'Review submitted successfully', ['id' => $conn->lastInsertId()], 201);
    } catch (PDOException $e) {
        sendResponse(false, 'Database Error: ' . $e->getMessage(), null, 500);
    }
}
?>
