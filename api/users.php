<?php
require_once('config.php');

$userId = verifyToken();

// Temporary debug logging -- remove after diagnosis
try {
    $debugLog = __DIR__ . '/../tmp/users_api_debug.log';
    $payload = file_get_contents('php://input');
    $entry = [
        'time' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'] ?? null,
        'uri' => $_SERVER['REQUEST_URI'] ?? null,
        'get' => $_GET ?? null,
        'payload' => $payload,
        'userId' => $userId ?? null
    ];
    file_put_contents($debugLog, json_encode($entry) . PHP_EOL, FILE_APPEND);
} catch (Exception $e) {
    // ignore logging failures
}
$method = $_SERVER['REQUEST_METHOD'];

// Get user info again for role checking
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$userId]);
$user = $roleStmt->fetch();

if ($method == 'GET') {
    // Check role
    if ($user['role'] === 'business_owner' || $user['role'] === 'admin') {
        $stmt = $conn->prepare("SELECT id as _id, name, email, phone, role, avatar, category, created_at, created_at as createdAt FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $users = $stmt->fetchAll();
    } elseif ($user['role'] === 'staff') {
        // Staff can see users who requested their businesses (Leads)
        $stmt = $conn->prepare("SELECT DISTINCT u.id as _id, u.name, u.email, u.phone, u.role, u.avatar, u.category, u.created_at, u.created_at as createdAt 
                                FROM users u 
                                JOIN service_requests r ON u.id = r.user_id 
                                JOIN businesses b ON r.business_id = b.id 
                                WHERE b.owner_id = ? AND u.role = 'user'
                                ORDER BY u.created_at DESC");
        $stmt->execute([$userId]);
        $users = $stmt->fetchAll();
    } elseif ($user['role'] === 'client') {
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
            $users = [];
        } else {
            $placeholders = implode(', ', array_fill(0, count($clientCategories), '?'));
            $query = "SELECT DISTINCT u.id as _id, u.name, u.email, u.phone, u.role, u.avatar, u.category, u.created_at, u.created_at as createdAt 
                      FROM users u 
                      LEFT JOIN service_requests r ON u.id = r.user_id 
                      LEFT JOIN businesses b ON r.business_id = b.id 
                      WHERE u.role = 'user' AND (u.category IN ($placeholders) OR b.category IN ($placeholders))
                      ORDER BY u.created_at DESC";
            
            $params = array_merge($clientCategories, $clientCategories);
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $users = $stmt->fetchAll();
        }
    } else {
        sendResponse(false, 'Unauthorized access required.', null, 403);
    }
    
    sendResponse(true, 'Users retrieved', $users);

} elseif ($method == 'POST') {
    $action = $_GET['action'] ?? null;
    $roleStmt = $conn->prepare("SELECT role, category FROM users WHERE id = ?");
    if ($action === 'staff' || $action === 'client') {
        if ($user['role'] !== 'business_owner' && $user['role'] !== 'admin') {
            sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
        }
        
        $data = getJsonInput();
        $name = $data['name'] ?? null;
        $email = strtolower($data['email'] ?? '');
        $phone = $data['phone'] ?? null;
        $password = $data['password'] ?? null;
        $category = $data['category'] ?? null;
        $role = $action === 'staff' ? 'staff' : 'client';
        
        if (!$name || !$email || !$phone || !$password) {
            sendResponse(false, 'Please provide all details for account', null, 400);
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            // First, verify the category column exists
            $checkColumn = $conn->prepare("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'category'");
            $checkColumn->execute();
            $columnExists = $checkColumn->fetch();
            
            if (!$columnExists) {
                // Try to add the column if it doesn't exist
                try {
                    $conn->exec("ALTER TABLE users ADD COLUMN category VARCHAR(255) DEFAULT NULL AFTER role");
                } catch (PDOException $e) {
                    // Column might already exist or other DB issue
                }
            }
            
            // If category is an array, store as JSON string for multi-category support
            if (is_array($category)) {
                $categoryToStore = json_encode(array_values($category));
            } else {
                $categoryToStore = $category;
            }

            $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password, role, category) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $hashedPassword, $role, $categoryToStore]);
            sendResponse(true, ucfirst($role) . ' account created successfully', ['id' => $conn->lastInsertId()], 201);
        } catch (PDOException $e) {
            // Log the error
            error_log('Error creating ' . $role . ': ' . $e->getMessage());
            error_log('SQL Error Code: ' . $e->getCode());
            sendResponse(false, 'Failed to create ' . $role . ': ' . $e->getMessage(), null, 500);
        }
    }

} elseif ($method == 'PUT') {
    $action = $_GET['action'] ?? null;
    // Admin updating other users
    if ($action === 'update-user') {
        // Only business owners or admins can update arbitrary users
        if ($user['role'] !== 'business_owner' && $user['role'] !== 'admin') {
            sendResponse(false, 'Unauthorized. Admin access required.', null, 403);
        }

        $targetId = $_GET['id'] ?? null;
        if (!$targetId && isset($_GET['action']) && is_numeric($_GET['action'])) {
            $targetId = $_GET['action'];
        }

        $data = getJsonInput();
        $name = $data['name'] ?? null;
        $email = isset($data['email']) ? strtolower($data['email']) : null;
        $phone = $data['phone'] ?? null;
        $category = $data['category'] ?? null;
        $password = $data['password'] ?? null;

        if (!$targetId) {
            sendResponse(false, 'Missing target user ID', null, 400);
        }

        $updates = [];
        $params = [];

        if ($name !== null) { $updates[] = "name = ?"; $params[] = $name; }
        if ($email !== null) { $updates[] = "email = ?"; $params[] = $email; }
        if ($phone !== null) { $updates[] = "phone = ?"; $params[] = $phone; }
        if ($category !== null) {
            // Accept array for categories and store as JSON
            if (is_array($category)) {
                $categoryToStore = json_encode(array_values($category));
            } else {
                $categoryToStore = $category;
            }
            $updates[] = "category = ?"; $params[] = $categoryToStore;
        }
        if ($password) { $updates[] = "password = ?"; $params[] = password_hash($password, PASSWORD_DEFAULT); }

        if (count($updates) === 0) {
            sendResponse(false, 'No update fields provided', null, 400);
        }

        $params[] = $targetId;
        $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        try {
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            sendResponse(true, 'User updated successfully');
        } catch (PDOException $e) {
            error_log('Error updating user: '.$e->getMessage());
            sendResponse(false, 'Failed to update user', null, 500);
        }
    }

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
    if (!$targetId && isset($_GET['action']) && is_numeric($_GET['action'])) {
        $targetId = $_GET['action'];
    }
    
    if ($targetId) {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$targetId]);
        sendResponse(true, 'User deleted successfully');
    } else {
        sendResponse(false, 'Missing user ID', null, 400);
    }
}
?>
