<?php
require_once('config.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    $keyword = $_GET['keyword'] ?? null;
    $category = $_GET['category'] ?? null;
    $city = $_GET['city'] ?? null;
    $sort = $_GET['sort'] ?? null;
    $ids = $_GET['ids'] ?? null;
    
    if ($action === 'all-listings') {
        $query = "SELECT * FROM businesses WHERE 1=1";
    } else {
        $query = "SELECT * FROM businesses WHERE is_approved = 1";
    }
    $params = [];
    
    if ($ids) {
        $idArray = explode(',', $ids);
        $placeholders = implode(',', array_fill(0, count($idArray), '?'));
        $query .= " AND id IN ($placeholders)";
        $params = array_merge($params, $idArray);
    }
    
    if ($keyword) {
        $query .= " AND (title LIKE ? OR category LIKE ? OR description LIKE ?)";
        $params[] = "%$keyword%";
        $params[] = "%$keyword%";
        $params[] = "%$keyword%";
    }
    
    if ($category) {
        $query .= " AND category LIKE ?";
        $params[] = "%$category%";
    }
    
    if ($city) {
        $query .= " AND city LIKE ?";
        $params[] = "%$city%";
    }
    
    if ($sort === 'rating') {
        $query .= " ORDER BY average_rating DESC";
    } elseif ($sort === 'views') {
        $query .= " ORDER BY views DESC";
    } else {
        $query .= " ORDER BY created_at DESC";
    }
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $businesses = $stmt->fetchAll();
    
    // Format addresses and images to match Node.js structure
    foreach ($businesses as &$b) {
        $b['_id'] = $b['id'];
        $b['ownerId'] = $b['owner_id'];
        $b['averageRating'] = (float)$b['average_rating'];
        $b['reviewCount'] = (int)$b['review_count'];
        $b['isApproved'] = (bool)$b['is_approved'];

        $b['address'] = [
            'street' => $b['street'],
            'city' => $b['city'],
            'state' => $b['state'],
            'zip' => $b['zip']
        ];
        $b['images'] = $b['images'] ? json_decode($b['images']) : [];
        $b['timings'] = [
            'open' => $b['open_time'],
            'close' => $b['close_time']
        ];
    }
    
    sendResponse(true, 'Businesses retrieved', $businesses);

} elseif ($method == 'POST') {
    $userId = verifyToken();
    $action = $_GET['action'] ?? null;
    
    // BULK UPLOAD HANDLER
    if ($action === 'bulk-upload') {
        if (!isset($_FILES['file'])) {
            sendResponse(false, 'Please upload a CSV file', null, 400);
        }

        $file = $_FILES['file']['tmp_name'];
        $handle = fopen($file, "r");
        
        // Read Headers
        $headers = fgetcsv($handle);
        if (!$headers) {
             sendResponse(false, 'Invalid CSV format', null, 400);
        }

        $addedCount = 0;
        $categoryCount = 0;

        while (($row = fgetcsv($handle)) !== FALSE) {
            // Map row to headers
            if (count($headers) !== count($row)) continue;
            $csvData = array_combine($headers, $row);

            $title = $csvData['title'] ?? $csvData['Title'] ?? null;
            $category = $csvData['category'] ?? $csvData['Category'] ?? null;
            $description = $csvData['description'] ?? $csvData['Description'] ?? '';
            $street = $csvData['street'] ?? $csvData['Street'] ?? '';
            $city = $csvData['city'] ?? $csvData['City'] ?? '';
            $state = $csvData['state'] ?? $csvData['State'] ?? '';
            $zip = $csvData['zip'] ?? $csvData['Zip'] ?? '';
            $phone = $csvData['phone'] ?? $csvData['Phone'] ?? '';
            $email = $csvData['email'] ?? $csvData['Email'] ?? '';
            $website = $csvData['website'] ?? $csvData['Website'] ?? '';
            $whatsapp = $csvData['whatsapp'] ?? $csvData['Whatsapp'] ?? '';
            $openTime = $csvData['openTime'] ?? '09:00';
            $closeTime = $csvData['closeTime'] ?? '21:00';

            if (!$title || !$category) continue;

            // 1. Handle Category automatic addition
            $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
            $stmt->execute([trim($category)]);
            if (!$stmt->fetch()) {
                $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
                $stmt->execute([trim($category)]);
                $categoryCount++;
            }

            // 2. Create Business
            $stmt = $conn->prepare("INSERT INTO businesses (owner_id, title, description, category, street, city, state, zip, phone, email, website, whatsapp, open_time, close_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, trim($title), trim($description), trim($category), trim($street), trim($city), trim($state), trim($zip), trim($phone), trim($email), trim($website), trim($whatsapp), $openTime, $closeTime]);
            
            $addedCount++;
        }
        fclose($handle);

        sendResponse(true, "Bulk Upload Successful! Added $addedCount listings and $categoryCount new categories.", ['count' => $addedCount], 200);
    }

    $data = getJsonInput();
    
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $category = $data['category'] ?? null;
    $street = $data['street'] ?? null;
    $city = $data['city'] ?? null;
    $state = $data['state'] ?? null;
    $zip = $data['zip'] ?? null;
    $phone = $data['phone'] ?? null;
    $email = $data['email'] ?? null;
    $website = $data['website'] ?? null;
    $whatsapp = $data['whatsapp'] ?? null;
    $openTime = $data['timings']['open'] ?? '09:00';
    $closeTime = $data['timings']['close'] ?? '21:00';
    $lat = $data['lat'] ?? 0;
    $lng = $data['lng'] ?? 0;
    
    if (!$title || !$description || !$category || !$street || !$city || !$state || !$zip || !$phone) {
        sendResponse(false, 'Missing required fields', null, 400);
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO businesses (owner_id, title, description, category, street, city, state, zip, phone, email, website, whatsapp, open_time, close_time, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $description, $category, $street, $city, $state, $zip, $phone, $email, $website, $whatsapp, $openTime, $closeTime, $lat, $lng]);
        $businessId = $conn->lastInsertId();
        
        sendResponse(true, 'Business created successfully', ['id' => $businessId], 201);
    } catch (PDOException $e) {
        sendResponse(false, 'Database Error: ' . $e->getMessage(), null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
