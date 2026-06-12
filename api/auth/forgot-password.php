<?php
require_once('../config.php');
require_once('../utils/sendEmail.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = getJsonInput();
    $email = strtolower($data['email'] ?? '');
    
    if (!$email) {
        sendResponse(false, 'Please provide an email address', null, 400);
    }
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, 'No user found with this email', null, 400);
    }
    
    // Generate 6-digit OTP
    $otpCode = (string)rand(100000, 999999);
    $otpExpiry = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes
    
    $stmt = $conn->prepare("UPDATE users SET reset_password_otp = ?, reset_password_otp_expiry = ? WHERE id = ?");
    $stmt->execute([$otpCode, $otpExpiry, $user['id']]);
    
    $subject = 'TopTechDial - Forgot Password Verification';
    $message = "<h3>Your reset password OTP code is: <strong>$otpCode</strong></h3><p>Code expires in 10 minutes.</p>";
    
    if (sendEmail($email, $subject, $message)) {
        sendResponse(true, 'OTP sent to your email address', ['email' => $email, 'mockOtp' => $otpCode], 200);
    } else {
        sendResponse(false, 'Email deliverability failed', null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
