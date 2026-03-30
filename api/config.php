<?php
// CORS Headers (MUST BE AT THE TOP to work even if the rest of the script fails)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Environment detection
$isProd = $_SERVER['HTTP_HOST'] === 'toptechdial.com';

if ($isProd) {
    // HOSTINGER LIVE SETTINGS
    define('DB_HOST', 'localhost'); // Usually stays localhost on Hostinger
    define('DB_USER', 'u123456789_ttd_user'); // REPLACE WITH YOUR HOSTINGER DB USER
    define('DB_PASS', 'YOUR_DB_PASSWORD');    // REPLACE WITH YOUR HOSTINGER DB PASS
    define('DB_NAME', 'u123456789_toptechdial'); // REPLACE WITH YOUR HOSTINGER DB NAME
    define('BASE_URL', 'https://toptechdial.com/api/');
} else {
    // LOCALHOST SETTINGS
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'toptechdial');
    define('BASE_URL', 'http://localhost/TopTechDial_php/TopTechDial/api/');
}

// SMTP Configuration (from old backend .env)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'ttdreact@gmail.com');
define('SMTP_PASS', 'vudtkrdxylxvvmhb'); // Gmail App Password
define('SMTP_FROM', 'ttdreact@gmail.com');
define('SMTP_FROM_NAME', 'TopTechDial');

// Connect to Database
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $e->getMessage()]));
}

// JWT Secret (Simplified for now - can use a library if needed)

define('JWT_SECRET', 'bd43560ae6252d7028f810110e3374d997878a1e05af8b9350dcbd027418cb1c7bf2eaffd3d0cfa212f2cc167dfc76cff1a3c5740318ea0e94ab26bbb02954de');

// Autoload Utility Classes
require_once(__DIR__ . '/utils/Logger.php');
require_once(__DIR__ . '/utils/Mailer.php');
require_once(__DIR__ . '/utils/Validator.php');
require_once(__DIR__ . '/utils/DashboardService.php');

// Helper function to send response
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Helper function to get JSON input
function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}

// Helper function to generate a simple JWT (for demonstration/testing)
function generateToken($userId) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(['id' => $userId, 'iat' => time(), 'exp' => time() + (30 * 24 * 60 * 60)]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Helper function to verify token
function verifyToken() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = null;
    
    // Check all possible header sources
    foreach ($headers as $name => $value) {
        if (strtolower($name) === 'authorization') {
            $authHeader = $value;
            break;
        }
    }
    
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    
    // Debug Logging for troubleshooting persistent 401s
    $debug = [
        'time' => date('Y-m-d H:i:s'),
        'uri' => $_SERVER['REQUEST_URI'],
        'method' => $_SERVER['REQUEST_METHOD'],
        'authHeaderFound' => !empty($authHeader),
        'rawAuthHeader' => $authHeader
    ];

    if (!$authHeader) {
        file_put_contents(__DIR__ . '/../tmp/auth_debug.log', json_encode($debug) . "\n", FILE_APPEND);
        sendResponse(false, 'Unauthorized: No token found', null, 401);
    }
    
    $token = preg_replace('/^Bearer\s+/i', '', $authHeader);
    
    $tokenParts = explode('.', $token);
    if (count($tokenParts) != 3) {
        $debug['error'] = 'Invalid format';
        file_put_contents(__DIR__ . '/../tmp/auth_debug.log', json_encode($debug) . "\n", FILE_APPEND);
        sendResponse(false, 'Unauthorized: Invalid format', null, 401);
    }
    
    $decodePart = function($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    };

    $headerStr = $decodePart($tokenParts[0]);
    $payloadStr = $decodePart($tokenParts[1]);
    $signatureProvided = $tokenParts[2];
    
    $signature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if ($base64UrlSignature !== $signatureProvided) {
        $debug['error'] = 'Signature mismatch';
        $debug['expected'] = $base64UrlSignature;
        $debug['provided'] = $signatureProvided;
        file_put_contents(__DIR__ . '/../tmp/auth_debug.log', json_encode($debug) . "\n", FILE_APPEND);
        sendResponse(false, 'Unauthorized: Signature mismatch', null, 401);
    }
    
    $payloadData = json_decode($payloadStr, true);
    if ($payloadData['exp'] < time()) {
        $debug['error'] = 'Token expired';
        file_put_contents(__DIR__ . '/../tmp/auth_debug.log', json_encode($debug) . "\n", FILE_APPEND);
        sendResponse(false, 'Unauthorized: Token expired', null, 401);
    }
    
    return $payloadData['id'];
}
?>
