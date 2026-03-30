<?php
require_once('../config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = getJsonInput();
    
    $name = $data['name'] ?? null;
    $email = strtolower($data['email'] ?? '');
    $password = $data['password'] ?? null;
    $phone = $data['phone'] ?? null;
    $role = $data['role'] ?? 'user';
    
    if (!$name || !$email || !$password || !$phone) {
        sendResponse(false, 'Please provide all required fields', null, 400);
    }
    
    if ($role === 'business_owner') {
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'business_owner'");
        $stmt->execute();
        if ($stmt->fetch()['count'] > 0) {
            sendResponse(false, 'Only one Business Owner account is permitted on this platform.', null, 400);
        }
    }
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(false, 'User already exists with this email', null, 400);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Create user
    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hashedPassword, $phone, $role]);
        $userId = $conn->lastInsertId();
        
        // Return user data with token
        $userData = [
            '_id' => $userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'role' => $role,
            'avatar' => null,
            'savedItems' => [],
            'favoriteItems' => [],
            'token' => generateToken($userId)
        ];
        
        sendResponse(true, 'User registered successfully', $userData, 201);
    } catch (PDOException $e) {
        sendResponse(false, 'Database Error: ' . $e->getMessage(), null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
