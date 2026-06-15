<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

// Simple mock purchase: owner posts { credits: 10, amount: 50.00 }
if ($method === 'POST') {
    $data = getJsonInput();
    $credits = (int)($data['credits'] ?? 0);
    $amount = (float)($data['amount'] ?? 0);
    $provider = $data['provider'] ?? 'mock';
    $providerRef = $data['providerRef'] ?? null;

    if ($credits <= 0 || $amount <= 0) {
        sendResponse(false, 'Credits and amount are required', null, 400);
    }

    try {
        $stmt = $conn->prepare("INSERT INTO payments (owner_id, amount, credits_purchased, provider, provider_ref) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $amount, $credits, $provider, $providerRef]);

        // Upsert owner_credits
        $up = $conn->prepare("INSERT INTO owner_credits (owner_id, credits) VALUES (?, ?) ON DUPLICATE KEY UPDATE credits = credits + VALUES(credits)");
        $up->execute([$userId, $credits]);

        sendResponse(true, 'Purchase successful', ['credits' => $credits, 'amount' => $amount]);
    } catch (PDOException $e) {
        sendResponse(false, 'Payment failed: ' . $e->getMessage(), null, 500);
    }

} elseif ($method === 'GET') {
    // List payments for owner
    try {
        $stmt = $conn->prepare("SELECT * FROM payments WHERE owner_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        sendResponse(true, 'Payments retrieved', $rows);
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to load payments', null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}

?>
