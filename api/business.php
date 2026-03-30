<?php
require_once('config.php');

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if (!$id) {
    sendResponse(false, 'Business ID is required', null, 400);
}

if ($method == 'GET') {
    $stmt = $conn->prepare("SELECT * FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    $business = $stmt->fetch();
    
    if (!$business) {
        sendResponse(false, 'Business not found', null, 404);
    }
    
    // Update views
    $stmt = $conn->prepare("UPDATE businesses SET views = views + 1 WHERE id = ?");
    $stmt->execute([$id]);
    
    // Process formatting
    $business['_id'] = $business['id'];
    $business['ownerId'] = $business['owner_id'];
    $business['averageRating'] = (float)$business['average_rating'];
    $business['reviewCount'] = (int)$business['review_count'];
    $business['isApproved'] = (bool)$business['is_approved'];
    
    $business['address'] = [
        'street' => $business['street'],
        'city' => $business['city'],
        'state' => $business['state'],
        'zip' => $business['zip']
    ];
    $business['images'] = $business['images'] ? json_decode($business['images']) : [];
    $business['timings'] = [
        'open' => $business['open_time'],
        'close' => $business['close_time']
    ];
    
    sendResponse(true, 'Business retrieved', $business);

} elseif ($method == 'PUT') {
    $userId = verifyToken();
    $data = getJsonInput();
    
    // Check permission - Allow owner or admin/staff
    $stmt = $conn->prepare("SELECT * FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    $business = $stmt->fetch();
    
    if (!$business) {
        sendResponse(false, 'Business not found', null, 404);
    }

    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $currentUser = $stmt->fetch();
    $isAdmin = $currentUser && ($currentUser['role'] === 'business_owner' || $currentUser['role'] === 'staff');

    if ($business['owner_id'] != $userId && !$isAdmin) {
        sendResponse(false, 'Not authorized to edit this listing', null, 403);
    }
    
    // Comprehensive update logic
    $title = $data['title'] ?? $business['title'];
    $description = $data['description'] ?? $business['description'];
    $category = $data['category'] ?? $business['category'];
    $street = $data['street'] ?? $business['street'];
    $city = $data['city'] ?? $business['city'];
    $state = $data['state'] ?? $business['state'];
    $zip = $data['zip'] ?? $business['zip'];
    $phone = $data['phone'] ?? $business['phone'];
    $email = $data['email'] ?? $business['email'];
    $website = $data['website'] ?? $business['website'];
    $whatsapp = $data['whatsapp'] ?? $business['whatsapp'];
    $openTime = $data['timings']['open'] ?? $business['open_time'];
    $closeTime = $data['timings']['close'] ?? $business['close_time'];
    $isApproved = isset($data['isApproved']) ? (int)$data['isApproved'] : $business['is_approved'];
    
    $stmt = $conn->prepare("UPDATE businesses SET 
        title = ?, description = ?, category = ?, street = ?, city = ?, state = ?, zip = ?, 
        phone = ?, email = ?, website = ?, whatsapp = ?, open_time = ?, close_time = ?, is_approved = ?
        WHERE id = ?");
    $stmt->execute([
        $title, $description, $category, $street, $city, $state, $zip, 
        $phone, $email, $website, $whatsapp, $openTime, $closeTime, $isApproved, $id
    ]);
    
    sendResponse(true, 'Business updated successfully', ['id' => $id]);

} elseif ($method == 'DELETE') {
    $userId = verifyToken();
    
    $stmt = $conn->prepare("SELECT owner_id FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    $business = $stmt->fetch();
    if (!$business || $business['owner_id'] != $userId) {
        sendResponse(false, 'Not authorized', null, 403);
    }
    
    $stmt = $conn->prepare("DELETE FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(true, 'Business deleted successfully');
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
