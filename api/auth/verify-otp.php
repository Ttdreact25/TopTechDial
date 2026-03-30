<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = getJsonInput();
    
    $email = strtolower($data['email'] ?? '');
    $otp = $data['otp'] ?? null;
    
    if (!$email || !$otp) {
        sendResponse(false, 'Please provide email and OTP', null, 400);
    }
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, 'Invalid request', null, 401);
    }
    
    if (!$user['otp'] || $user['otp'] !== $otp) {
        sendResponse(false, 'Invalid or expired OTP code', null, 400);
    }
    
    // Check Expiry
    if (time() > strtotime($user['otp_expiry'])) {
        $stmt = $conn->prepare("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = ?");
        $stmt->execute([$user['id']]);
        sendResponse(false, 'OTP has expired. Please login again.', null, 400);
    }
    
    // Clear OTP after success
    $stmt = $conn->prepare("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Fetch Saved & Favorite Items for the user
    $stmtS = $conn->prepare("SELECT business_id FROM saved_items WHERE user_id = ?");
    $stmtS->execute([$user['id']]);
    $savedItems = $stmtS->fetchAll(PDO::FETCH_COLUMN);

    $stmtF = $conn->prepare("SELECT business_id FROM favorite_items WHERE user_id = ?");
    $stmtF->execute([$user['id']]);
    $favoriteItems = $stmtF->fetchAll(PDO::FETCH_COLUMN);

    $avatarUrl = $user['avatar'];
    if ($avatarUrl && strpos($avatarUrl, 'http') !== 0) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . str_replace('auth/verify-otp.php', '', $_SERVER['SCRIPT_NAME']);
        $avatarUrl = $baseUrl . $avatarUrl;
    }

    $userData = [
        '_id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'avatar' => $avatarUrl,
        'savedItems' => $savedItems,
        'favoriteItems' => $favoriteItems,
        'token' => generateToken($user['id'])
    ];
    
    sendResponse(true, 'Login successful!', $userData, 200);
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
