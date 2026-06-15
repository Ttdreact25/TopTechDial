<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Return leads for businesses owned by this user
    try {
        $stmt = $conn->prepare("SELECT l.*, b.title as businessTitle FROM leads l JOIN businesses b ON l.business_id = b.id WHERE b.owner_id = ? ORDER BY l.created_at DESC");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        sendResponse(true, 'Leads retrieved', $rows);
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to load leads', null, 500);
    }

} elseif ($method === 'PUT') {
    // Update lead status (e.g., mark responded)
    $id = $_GET['id'] ?? null;
    $data = getJsonInput();
    $status = $data['status'] ?? null;

    if (!$id || !$status) {
        sendResponse(false, 'Lead ID and status are required', null, 400);
    }

    try {
        // Ensure owner owns the business for this lead
        $vstmt = $conn->prepare("SELECT l.id FROM leads l JOIN businesses b ON l.business_id = b.id WHERE l.id = ? AND b.owner_id = ?");
        $vstmt->execute([$id, $userId]);
        if (!$vstmt->fetch()) {
            sendResponse(false, 'Not authorized to modify this lead', null, 403);
        }

        $ustmt = $conn->prepare("UPDATE leads SET status = ? WHERE id = ?");
        $ustmt->execute([$status, $id]);
        sendResponse(true, 'Lead updated');
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to update lead', null, 500);
    }

} else {
    sendResponse(false, 'Method not allowed', null, 405);
}

?>
