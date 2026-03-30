<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Search Engine with Advanced Weighted Scoring
 */

require_once('config.php');
require_once('enterprise/SecurityAuditor.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $keyword = $_GET['keyword'] ?? '';
    $category = $_GET['category'] ?? '';
    $city = $_GET['city'] ?? '';
    $userId = null; 
    
    // Attempt to verify token silently for logging/personalization purposes
    try {
        $userId = verifyToken();
    } catch (Exception $e) {
        $userId = null;
    }

    $auditor = new SecurityAuditor($conn);
    if (!$auditor->checkSearchRateLimit($userId, $_SERVER['REMOTE_ADDR'])) {
        sendResponse(false, 'Too many requests. Please wait.', null, 429);
    }

    $params = [];
    
    // We'll use a weighted search approach (Simulated using subqueries or CASE statements)
    // 1. Exact title match (Highest Weight)
    // 2. Partial title match (High Weight)
    // 3. Category match (Medium Weight)
    // 4. Description match (Low Weight)
    
    $query = "
        SELECT *, (
            CASE 
                WHEN title = ? THEN 100
                WHEN title LIKE ? THEN 50
                WHEN category LIKE ? THEN 30
                WHEN description LIKE ? THEN 10
                ELSE 0
            END
        ) as search_score
        FROM businesses
        WHERE is_approved = 1
    ";
    
    $params[] = $keyword;
    $params[] = "%$keyword%";
    $params[] = "%$keyword%";
    $params[] = "%$keyword%";

    if ($category) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    if ($city) {
        $query .= " AND city LIKE ?";
        $params[] = "%$city%";
    }

    $query .= " HAVING search_score > 0 OR (category = ? AND city LIKE ?) ORDER BY search_score DESC, created_at DESC LIMIT 50";
    $params[] = $category;
    $params[] = "%$city%";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    // Log the search for analytics
    $logStmt = $conn->prepare("INSERT INTO search_logs (user_id, query, category, location, user_ip) VALUES (?, ?, ?, ?, ?)");
    $logStmt->execute([$userId, $keyword, $category, $city, $_SERVER['REMOTE_ADDR']]);

    // Format for React frontend
    foreach ($results as &$b) {
        $b['_id'] = $b['id'];
        $b['address'] = [
            'street' => $b['street'],
            'city' => $b['city'],
            'state' => $b['state'],
            'zip' => $b['zip']
        ];
        $b['images'] = json_decode($b['images'] ?: '[]');
        $b['timings'] = ['open' => $b['open_time'], 'close' => $b['close_time']];
    }

    sendResponse(true, 'Search results found!', $results);
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
