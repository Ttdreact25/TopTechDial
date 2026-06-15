<?php
require_once('config.php');

$method = $_SERVER['REQUEST_METHOD'];
$userId = getUserIdFromToken();

function inferCategoryFromQuery($conn, $query, $currentCategory = null) {
    if ($currentCategory) {
        return $currentCategory;
    }

    $normalized = strtolower(trim($query ?? ''));
    if (!$normalized) {
        return null;
    }

    // First try existing category names in the database.
    try {
        $catStmt = $conn->query("SELECT name FROM categories");
        $allCats = $catStmt->fetchAll();
        foreach ($allCats as $row) {
            $catName = strtolower($row['name']);
            if ($catName && strpos($normalized, $catName) !== false) {
                return $row['name'];
            }
        }
    } catch (PDOException $e) {
        // Fall back to default heuristics on error.
    }

    $synonyms = [
        'restaurant' => 'Restaurant',
        'cafe' => 'Restaurant',
        'coffee' => 'Restaurant',
        'hotel' => 'HotelTravel',
        'travel' => 'HotelTravel',
        'clinic' => 'HealthMedical',
        'doctor' => 'HealthMedical',
        'medical' => 'HealthMedical',
        'hospital' => 'HealthMedical',
        'insurance' => 'InsuranceLaw',
        'lawyer' => 'InsuranceLaw',
        'shopping' => 'shopping',
        'shop' => 'shopping',
        'business' => 'business',
        'store' => 'shopping',
    ];

    foreach ($synonyms as $keyword => $category) {
        if (strpos($normalized, $keyword) !== false) {
            return $category;
        }
    }

    return null;
}

if ($method == 'GET') {
    $authUserId = verifyToken();
    $action = $_GET['action'] ?? null;

    if ($action === 'my-logs') {
        $query = "SELECT s.id as _id, s.search_query as query, s.category, s.city as location, s.user_ip as userIp, s.lat, s.lng, s.intent, s.results_count as resultsCount, s.created_at as createdAt, u.id as userId, u.name as userName, u.email as userEmail, u.phone as userPhone
                      FROM search_logs s 
                      LEFT JOIN users u ON s.user_id = u.id 
                      WHERE s.user_id = ? 
                      ORDER BY s.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute([$authUserId]);
        $logs = $stmt->fetchAll();
        
        foreach ($logs as &$log) {
            if ($log['userName']) {
                $log['user'] = [
                    '_id' => $log['userId'],
                    'name' => $log['userName'],
                    'email' => $log['userEmail'],
                    'phone' => $log['userPhone']
                ];
            } else {
                $log['user'] = null;
            }
            unset($log['userName'], $log['userEmail'], $log['userPhone'], $log['userId']);
        }
        sendResponse(true, 'Search logs retrieved', $logs);
    }

    $roleStmt = $conn->prepare("SELECT role, category FROM users WHERE id = ?");
    $roleStmt->execute([$authUserId]);
    $user = $roleStmt->fetch();

    // Admin and client can see analytics; clients only see their assigned category
    if (!$user || ($user['role'] !== 'business_owner' && $user['role'] !== 'admin' && $user['role'] !== 'client')) {
        sendResponse(false, 'Unauthorized. Admin or client access required.', null, 403);
    }


    $query = "SELECT s.id as _id, s.search_query as query, s.category, s.city as location, s.user_ip as userIp, s.lat, s.lng, s.intent, s.results_count as resultsCount, s.created_at as createdAt, u.id as userId, u.name as userName, u.email as userEmail, u.phone as userPhone
                  FROM search_logs s 
                  LEFT JOIN users u ON s.user_id = u.id ";
    $params = [];

    if ($user['role'] === 'client') {
        $clientCategoryRaw = $user['category'] ?? null;
        $clientCategories = [];
        if ($clientCategoryRaw) {
            $trim = trim($clientCategoryRaw);
            if ($trim && $trim[0] === '[') {
                $decoded = json_decode($clientCategoryRaw, true);
                if (is_array($decoded)) $clientCategories = $decoded;
            } else {
                $clientCategories = [$clientCategoryRaw];
            }
        }

        if (count($clientCategories) === 0) {
            // No categories assigned
            $query .= "WHERE 1=0 ";
        } else {
            $placeholders = implode(', ', array_fill(0, count($clientCategories), '?'));
            $query .= "WHERE s.category IN ($placeholders) ";
            foreach ($clientCategories as $c) $params[] = $c;
        }
    }

    $query .= "ORDER BY s.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    // Format to match frontend expectations
    foreach ($logs as &$log) {
        if ($log['userName']) {
            $log['user'] = [
                '_id' => $log['userId'],
                'name' => $log['userName'],
                'email' => $log['userEmail'],
                'phone' => $log['userPhone']
            ];
        } else {
            $log['user'] = null;
        }

        unset($log['userName'], $log['userEmail'], $log['userPhone'], $log['userId']);
    }
    
    sendResponse(true, 'Search logs retrieved', $logs);

} elseif ($method == 'POST') {
    $data = getJsonInput();
    $query = $data['query'] ?? null;
    $location = $data['location'] ?? null;
    $category = $data['category'] ?? null;
    $intent = $data['intent'] ?? null;
    $lat = isset($data['lat']) ? $data['lat'] : null;
    $lng = isset($data['lng']) ? $data['lng'] : null;
    $resultsCount = isset($data['resultsCount']) ? (int)$data['resultsCount'] : null;

    if (!$query && !$category && !$intent) {
        sendResponse(false, 'Search query, category or intent is required', null, 400);
    }

    $category = inferCategoryFromQuery($conn, $query, $category);
    $searchText = $query ?: $category ?: $intent;
    $userIp = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;
    if ($userIp && strpos($userIp, ',') !== false) {
        $userIp = trim(explode(',', $userIp)[0]);
    }

    try {
        $stmt = $conn->prepare("INSERT INTO search_logs (search_query, category, city, user_ip, lat, lng, intent, results_count, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$searchText, $category, $location, $userIp, $lat, $lng, $intent, $resultsCount, $userId]);
        sendResponse(true, 'Search logged successfully');
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to log search', null, 500);
    }
}
?>
