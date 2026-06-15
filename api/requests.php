<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

function queueLeadForApproval($conn, $requestId, $businessId, $userId, $name, $email, $phone, $message, $price = 0.00) {
    $stmt = $conn->prepare("INSERT INTO leads (service_request_id, business_id, customer_id, customer_name, customer_email, customer_phone, message, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)");
    $stmt->execute([$requestId, $businessId, $userId, $name, $email, $phone, $message, $price]);
}

function deliverPendingLead($conn, $requestId, $businessId) {
    $stmt = $conn->prepare("SELECT id FROM leads WHERE service_request_id = ? LIMIT 1");
    $stmt->execute([$requestId]);
    $lead = $stmt->fetch();

    if ($lead) {
        $ustmt = $conn->prepare("UPDATE leads SET status = 'delivered', delivered_at = NOW() WHERE id = ?");
        $ustmt->execute([$lead['id']]);
    } else {
        $ustmt = $conn->prepare("INSERT INTO leads (service_request_id, business_id, status, price, delivered_at) VALUES (?, ?, 'delivered', 0.00, NOW())");
        $ustmt->execute([$requestId, $businessId]);
    }

    $bstmt = $conn->prepare("SELECT owner_id FROM businesses WHERE id = ?");
    $bstmt->execute([$businessId]);
    $biz = $bstmt->fetch();
    $ownerId = $biz ? $biz['owner_id'] : null;
    if ($ownerId) {
        $cstmt = $conn->prepare("SELECT credits FROM owner_credits WHERE owner_id = ?");
        $cstmt->execute([$ownerId]);
        $creditRow = $cstmt->fetch();
        $credits = $creditRow ? (int)$creditRow['credits'] : 0;
        if ($credits > 0) {
            $dstmt = $conn->prepare("UPDATE owner_credits SET credits = credits - 1 WHERE owner_id = ?");
            $dstmt->execute([$ownerId]);
        }
    }
}

function rejectPendingLead($conn, $requestId) {
    $stmt = $conn->prepare("UPDATE leads SET status = 'rejected' WHERE service_request_id = ?");
    $stmt->execute([$requestId]);
}

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
    $requestId = $conn->lastInsertId();

    // Queue lead for admin review only; do not deliver directly to clients until admin approves.
    try {
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $phone = $data['phone'] ?? null;
        $message = $data['message'] ?? null;
        $leadPrice = 0.00;
        queueLeadForApproval($conn, $requestId, $businessId, $userId, $name, $email, $phone, $message, $leadPrice);
    } catch (PDOException $e) {
        file_put_contents(__DIR__ . '/../tmp/lead_error.log', date('c') . " - Lead queue failed: " . $e->getMessage() . "\n", FILE_APPEND);
    }

    sendResponse(true, 'Request submitted and pending admin approval.', ['id' => $requestId], 201);
} elseif ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'admin') {
        // Only business_owner (Admin) or client can see requests
        $roleStmt = $conn->prepare("SELECT role, category FROM users WHERE id = ?");
        $roleStmt->execute([$userId]);
        $user = $roleStmt->fetch();
        $userRole = $user ? $user['role'] : null;
        
        if ($userRole !== 'business_owner' && $userRole !== 'client') {
            sendResponse(false, 'Unauthorized. Admin or client access required.', null, 403);
        }

        if ($userRole === 'client') {
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
                $rows = [];
            } else {
                $placeholders = implode(', ', array_fill(0, count($clientCategories), '?'));
                $stmt = $conn->prepare("SELECT r.id, r.status, r.created_at, b.id as b_id, b.title as b_title, b.category as b_cat, 
                                             u.id as u_id, u.name as u_name, u.email as u_email, u.phone as u_phone
                                      FROM service_requests r 
                                      JOIN businesses b ON r.business_id = b.id 
                                      JOIN users u ON r.user_id = u.id 
                                      WHERE b.category IN ($placeholders)
                                      ORDER BY r.created_at DESC");
                $stmt->execute($clientCategories);
                $rows = $stmt->fetchAll();
            }
        } else {
            $stmt = $conn->prepare("SELECT r.id, r.status, r.created_at, b.id as b_id, b.title as b_title, b.category as b_cat, 
                                         u.id as u_id, u.name as u_name, u.email as u_email, u.phone as u_phone
                                  FROM service_requests r 
                                  JOIN businesses b ON r.business_id = b.id 
                                  JOIN users u ON r.user_id = u.id 
                                  ORDER BY r.created_at DESC");
            $stmt->execute();
            $rows = $stmt->fetchAll();
        }
        
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

    $roleStmt = $conn->prepare("SELECT role, category FROM users WHERE id = ?");
    $roleStmt->execute([$userId]);
    $user = $roleStmt->fetch();
    $userRole = $user ? $user['role'] : null;
    if ($userRole !== 'business_owner' && $userRole !== 'client') {
        sendResponse(false, 'Unauthorized. Admin or client access required to update requests.', null, 403);
    }

    // Ensure request exists before updating
    $reqStmt = $conn->prepare("SELECT r.business_id, b.category as b_cat FROM service_requests r JOIN businesses b ON r.business_id = b.id WHERE r.id = ?");
    $reqStmt->execute([$id]);
    $request = $reqStmt->fetch();
    if (!$request) {
        sendResponse(false, 'Request not found', null, 404);
    }

    if ($userRole === 'client') {
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
        if (!in_array($request['b_cat'], $clientCategories)) {
            sendResponse(false, 'Unauthorized. You can only update requests within your assigned categories.', null, 403);
        }
    }

    $stmt = $conn->prepare("UPDATE service_requests SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    if ($status === 'approved') {
        deliverPendingLead($conn, $id, $request['business_id']);
    } elseif ($status === 'rejected') {
        rejectPendingLead($conn, $id);
    }
    
    sendResponse(true, 'Request updated successfully');
}
?>
