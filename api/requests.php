<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = getJsonInput();
    $businessId = $data['businessId'] ?? null;
    
    if (!$businessId) {
        sendResponse(false, 'Business ID is required', null, 400);
    }
    
    // Check duplicate
    $stmt = $conn->prepare("SELECT id FROM service_requests WHERE user_id = ? AND business_id = ? AND status != 'rejected'");
    $stmt->execute([$userId, $businessId]);
    if ($stmt->fetch()) {
        sendResponse(false, 'You already have a pending or approved request for this service.', null, 400);
    }
    
    $stmt = $conn->prepare("INSERT INTO service_requests (user_id, business_id) VALUES (?, ?)");
    $stmt->execute([$userId, $businessId]);
    
    sendResponse(true, 'Request sent to Admin for approval.', ['id' => $conn->lastInsertId()], 201);

} elseif ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'admin') {
        // Only business_owner (Admin) can see all requests
        $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $roleStmt->execute([$userId]);
        $userRole = $roleStmt->fetch()['role'];
        
        if ($userRole !== 'business_owner') {
            sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
        }

        $stmt = $conn->prepare("SELECT r.id, r.status, r.created_at, b.id as b_id, b.title as b_title, b.category as b_cat, 
                                     u.id as u_id, u.name as u_name, u.email as u_email, u.phone as u_phone
                              FROM service_requests r 
                              JOIN businesses b ON r.business_id = b.id 
                              JOIN users u ON r.user_id = u.id 
                              ORDER BY r.created_at DESC");
        $stmt->execute();
        $rows = $stmt->fetchAll();
        
        $requests = [];
        foreach ($rows as $row) {
            $requests[] = [
                '_id' => $row['id'],
                'status' => $row['status'],
                'createdAt' => $row['created_at'],
                'businessId' => [
                    '_id' => $row['b_id'],
                    'title' => $row['b_title'],
                    'category' => $row['b_cat']
                ],
                'customerId' => [
                    '_id' => $row['u_id'],
                    'name' => $row['u_name'],
                    'email' => $row['u_email'],
                    'phone' => $row['u_phone']
                ]
            ];
        }
        sendResponse(true, 'All requests retrieved', $requests);

    } elseif ($action === 'check') {
        $businessId = $_GET['businessId'] ?? null;
        $stmt = $conn->prepare("SELECT status FROM service_requests WHERE user_id = ? AND business_id = ?");
        $stmt->execute([$userId, $businessId]);
        $request = $stmt->fetch();
        sendResponse(true, 'Status retrieved', $request ?: ['status' => 'none']);
        
    } elseif ($action === 'my-requests') {
        $stmt = $conn->prepare("SELECT r.*, b.title as b_title, b.category as b_cat FROM service_requests r JOIN businesses b ON r.business_id = b.id WHERE r.user_id = ? ORDER BY r.created_at DESC");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        
        $requests = [];
        foreach ($rows as $row) {
            $requests[] = [
                '_id' => $row['id'],
                'status' => $row['status'],
                'updatedAt' => $row['updated_at'] ?? $row['created_at'],
                'businessId' => [
                    '_id' => $row['business_id'],
                    'title' => $row['b_title'],
                    'category' => $row['b_cat']
                ]
            ];
        }
        sendResponse(true, 'My requests retrieved', $requests);
    }

} elseif ($method == 'PUT') {
    $id = $_GET['id'] ?? null;
    $data = getJsonInput();
    $status = $data['status'] ?? null;

    if (!$id || !$status) {
        sendResponse(false, 'Request ID and Status are required', null, 400);
    }

    $stmt = $conn->prepare("UPDATE service_requests SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    
    sendResponse(true, 'Request updated successfully');
}
?>
