<?php
require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

// Get user info again for role checking
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$userId]);
$user = $roleStmt->fetch();

if ($method == 'GET') {
    // Only Admin can see all users
    if ($user['role'] !== 'business_owner') {
        sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
    }
    
    $stmt = $conn->prepare("SELECT id as _id, name, email, phone, role, avatar, created_at FROM users ORDER BY created_at DESC");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    sendResponse(true, 'Users retrieved', $users);

} elseif ($method == 'POST') {
    $action = $_GET['action'] ?? null;
    
    if ($action === 'staff') {
        if ($user['role'] !== 'business_owner') {
            sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
        }
        
        $data = getJsonInput();
        $name = $data['name'] ?? null;
        $email = strtolower($data['email'] ?? '');
        $phone = $data['phone'] ?? null;
        $password = $data['password'] ?? null;
        
        if (!$name || !$email || !$phone || !$password) {
            sendResponse(false, 'Please provide all details for staff', null, 400);
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'staff')");
            $stmt->execute([$name, $email, $phone, $hashedPassword]);
            sendResponse(true, 'Staff account created successfully', ['id' => $conn->lastInsertId()], 201);
        } catch (PDOException $e) {
            sendResponse(false, 'Failed to create staff: ' . $e->getMessage(), null, 500);
        }
    }

} elseif ($method == 'PUT') {
    $action = $_GET['action'] ?? null;
    $data = getJsonInput();

    if ($action === 'profile') {
        $name = $data['name'] ?? null;
        $phone = $data['phone'] ?? null;
        $password = $data['password'] ?? null;
        $avatar = $data['avatar'] ?? null;
        
        $updates = ["name = ?", "phone = ?"];
        $params = [$name, $phone];
        
        if ($password) {
            $updates[] = "password = ?";
            $params[] = password_hash($password, PASSWORD_DEFAULT);
        }
        
        if ($avatar && strpos($avatar, 'data:image') === 0) {
            $uploadDir = 'uploads/avatars/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            
            $filename = 'user_' . $userId . '_' . time() . '.jpg';
            $dataParts = explode(',', $avatar);
            if (count($dataParts) > 1) {
                file_put_contents($uploadDir . $filename, base64_decode($dataParts[1]));
                $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . str_replace('users.php', '', $_SERVER['SCRIPT_NAME']);
                $avatarPath = $baseUrl . $uploadDir . $filename;
                $updates[] = "avatar = ?";
                $params[] = $avatarPath;
            }
        }
        
        $params[] = $userId;
        $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        
        // Return only what changed for context sync
        $updatedData = ['name' => $name, 'phone' => $phone];
        if (isset($avatarPath)) $updatedData['avatar'] = $avatarPath;
        
        sendResponse(true, 'Profile updated successfully', $updatedData);

    } elseif ($action === 'profile-avatar') {
        // Multi-part form-data avatar or Base64 (depending on frontend)
        // If Base64 in JSON:
        $avatar = $data['avatar'] ?? null;
        if (!$avatar) {
             // Handle multipart
             if (isset($_FILES['avatar'])) {
                $uploadDir = 'uploads/avatars/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                $filename = 'user_' . $userId . '_' . time() . '.' . $ext;
                move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadDir . $filename);
                
                // Construct the full public URL for the avatar
                $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . str_replace('users.php', '', $_SERVER['SCRIPT_NAME']);
                $avatarPath = $baseUrl . $uploadDir . $filename;
                
                $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
                $stmt->execute([$avatarPath, $userId]);
                sendResponse(true, 'Avatar updated successfully', ['avatar' => $avatarPath]);
             } else {
                 sendResponse(false, 'No avatar file provided', null, 400);
             }
        } else {
            // Placeholder for Base64 handling if needed
            $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
            $stmt->execute([$avatar, $userId]);
            sendResponse(true, 'Avatar updated successfully', ['avatar' => $avatar]);
        }

    } elseif ($action === 'change-password') {
        $currentPassword = $data['currentPassword'] ?? null;
        $newPassword = $data['newPassword'] ?? null;
        
        $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $stored = $stmt->fetch()['password'];
        
        if (!password_verify($currentPassword, $stored)) {
            sendResponse(false, 'Current password incorrect', null, 401);
        }
        
        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed, $userId]);
        sendResponse(true, 'Password updated successfully');
    }

} elseif ($method == 'DELETE') {
    // Delete user (Admin only)
    if ($user['role'] !== 'business_owner') {
        sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
    }
    
    $targetId = $_GET['id'] ?? null;
    if ($targetId) {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$targetId]);
        sendResponse(true, 'User deleted successfully');
    } else {
        sendResponse(false, 'Missing user ID', null, 400);
    }
}
?>
