<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

// Get user info for role checking
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$userId]);
$user = $roleStmt->fetch();

if ($method == 'GET') {
    // Only Admin can see analytics
    if ($user['role'] !== 'business_owner') {
        sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
    }
    
    // Fetch search logs with optional user data
    $stmt = $conn->prepare("SELECT s.id as _id, s.search_query as query, s.city as location, s.created_at as createdAt, 
                                 u.name as userName, u.email as userEmail
                          FROM search_logs s 
                          LEFT JOIN users u ON s.user_id = u.id 
                          ORDER BY s.created_at DESC");
    $stmt->execute();
    $logs = $stmt->fetchAll();
    
    // Format to match frontend expectations
    foreach ($logs as &$log) {
        if ($log['userName']) {
            $log['user'] = [
                'name' => $log['userName'],
                'email' => $log['userEmail']
            ];
        } else {
            $log['user'] = null;
        }
    }
    
    sendResponse(true, 'Search logs retrieved', $logs);

} elseif ($method == 'POST') {
    // To record a search log (can be public or authenticated)
    $data = getJsonInput();
    $query = $data['query'] ?? null;
    $location = $data['location'] ?? null;
    $category = $data['category'] ?? null;
    
    if (!$query && !$category) {
        sendResponse(false, 'Search query or category is required', null, 400);
    }
    
    // We'll combine category and query for logging if needed
    $searchText = $query ?: $category;
    
    try {
        $stmt = $conn->prepare("INSERT INTO search_logs (search_query, city, user_id) VALUES (?, ?, ?)");
        $stmt->execute([$searchText, $location, $userId]);
        sendResponse(true, 'Search logged successfully');
    } catch (PDOException $e) {
        // Silently fail logging if there's an issue
        sendResponse(false, 'Failed to log search', null, 500);
    }
}
?>
