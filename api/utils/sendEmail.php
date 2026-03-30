<?php
// SMTP Email Sender using raw sockets (No external dependencies like PHPMailer required)
function sendEmail($to, $subject, $message) {
    if (DB_HOST === 'localhost' || !SMTP_HOST) {
        // Fallback/Logger for local development (XAMPP)
        $logFile = __DIR__ . '/../../tmp/mail_log.txt';
        $logContent = "[" . date('Y-m-d H:i:s') . "] To: $to | Subject: $subject | Message: $message\n";
        file_put_contents($logFile, $logContent, FILE_APPEND);
    }
    
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $user = SMTP_USER;
    $pass = SMTP_PASS;
    $from = SMTP_FROM;
    $name = SMTP_FROM_NAME;

    $header = "From: \"$name\" <$from>\r\n";
    $header .= "To: <$to>\r\n";
    $header .= "Subject: $subject\r\n";
    $header .= "MIME-Version: 1.0\r\n";
    $header .= "Content-Type: text/html; charset=UTF-8\r\n";
    $header .= "\r\n";

    try {
        $socket = fsockopen($host, $port, $errno, $errstr, 30);
        if (!$socket) throw new Exception("Could not connect to SMTP host: $errstr ($errno)");

        $getResponse = function($socket) {
            $response = "";
            while ($str = fgets($socket, 515)) {
                $response .= $str;
                if (substr($str, 3, 1) == " ") break;
            }
            return $response;
        };

        $getResponse($socket);
        fwrite($socket, "EHLO " . $_SERVER['HTTP_HOST'] . "\r\n");
        $getResponse($socket);

        fwrite($socket, "STARTTLS\r\n");
        $getResponse($socket);
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

        fwrite($socket, "EHLO " . $_SERVER['HTTP_HOST'] . "\r\n");
        $getResponse($socket);

        fwrite($socket, "AUTH LOGIN\r\n");
        $getResponse($socket);
        fwrite($socket, base64_encode($user) . "\r\n");
        $getResponse($socket);
        fwrite($socket, base64_encode($pass) . "\r\n");
        $getResponse($socket);

        fwrite($socket, "MAIL FROM: <$from>\r\n");
        $getResponse($socket);
        fwrite($socket, "RCPT TO: <$to>\r\n");
        $getResponse($socket);
        fwrite($socket, "DATA\r\n");
        $getResponse($socket);
        fwrite($socket, $header . $message . "\r\n.\r\n");
        $getResponse($socket);
        fwrite($socket, "QUIT\r\n");
        fclose($socket);

        return true;
    } catch (Exception $e) {
        return false;
    }
}
?>
