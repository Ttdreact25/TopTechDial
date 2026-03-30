<?php
require_once('../config.php');
require_once('../utils/sendEmail.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = getJsonInput();
    
    $email = strtolower($data['email'] ?? '');
    $password = $data['password'] ?? null;
    
    if (!$email || !$password) {
        sendResponse(false, 'Please provide email and password', null, 400);
    }
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, 'Invalid credentials', null, 401);
    }
    
    // Check Password (Support both hashed and plain text for legacy compatibility)
    $isMatch = password_verify($password, $user['password']) || $password === $user['password'];
    
    if (!$isMatch) {
        sendResponse(false, 'Invalid credentials', null, 401);
    }
    
    // Fetch Saved & Favorite Items for the user (needed for all roles to sync state)
    $stmtS = $conn->prepare("SELECT business_id FROM saved_items WHERE user_id = ?");
    $stmtS->execute([$user['id']]);
    $savedItems = array_map('intval', $stmtS->fetchAll(PDO::FETCH_COLUMN));

    $stmtF = $conn->prepare("SELECT business_id FROM favorite_items WHERE user_id = ?");
    $stmtF->execute([$user['id']]);
    $favoriteItems = $stmtF->fetchAll(PDO::FETCH_COLUMN);
    $favoriteItems = array_map('intval', $favoriteItems);

    $avatarUrl = $user['avatar'];
    if ($avatarUrl && strpos($avatarUrl, 'http') !== 0) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . str_replace('auth/login.php', '', $_SERVER['SCRIPT_NAME']);
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

    // Regular User can login directly
    if ($user['role'] === 'user') {
        sendResponse(true, 'Login successful', $userData, 200);
    }
    
    // For Owners and Staff - Mandatory OTP (No bypass for proper testing)
    if ($user['role'] === 'business_owner' || $user['role'] === 'staff') {
        
        $otpCode = (string)rand(100000, 999999);
        $otpExpiry = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes from now
        
        $stmt = $conn->prepare("UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?");
        $stmt->execute([$otpCode, $otpExpiry, $user['id']]);
        
        $subject = 'TopTechDial - Login Verification';
        $message = "<h3>Your login verification OTP code is: <strong>$otpCode</strong></h3><p>Code expires in 10 minutes.</p>";
        
        if (sendEmail($user['email'], $subject, $message)) {
            // Updated to TOP-LEVEL keys for React AuthContext parity
            echo json_encode([
                'success' => true,
                'message' => 'OTP sent to your registered email address',
                'email' => $user['email'],
                'requiresOtp' => true
            ]);
            exit();
        } else {
            sendResponse(false, 'Email deliverability failed', null, 500);
        }
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
