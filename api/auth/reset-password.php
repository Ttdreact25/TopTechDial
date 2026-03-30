<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = getJsonInput();
    
    $email = strtolower($data['email'] ?? '');
    $otp = $data['otp'] ?? null;
    $newPassword = $data['newPassword'] ?? null;
    
    if (!$email || !$otp || !$newPassword) {
        sendResponse(false, 'Please provide all details (Email, OTP, New Password)', null, 400);
    }
    
    $stmt = $conn->prepare("SELECT id, reset_password_otp, reset_password_otp_expiry FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, 'User not found', null, 400);
    }
    
    if (!$user['reset_password_otp'] || $user['reset_password_otp'] !== (string)$otp) {
        sendResponse(false, 'Invalid or expired OTP code', null, 400);
    }
    
    if (strtotime($user['reset_password_otp_expiry']) < time()) {
        $stmt = $conn->prepare("UPDATE users SET reset_password_otp = NULL, reset_password_otp_expiry = NULL WHERE id = ?");
        $stmt->execute([$user['id']]);
        sendResponse(false, 'OTP has expired. Please verify again.', null, 400);
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password and clear OTP
    $stmt = $conn->prepare("UPDATE users SET password = ?, reset_password_otp = NULL, reset_password_otp_expiry = NULL WHERE id = ?");
    $stmt->execute([$hashedPassword, $user['id']]);
    
    sendResponse(true, 'Password Reset Successful. You can now login.');
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
