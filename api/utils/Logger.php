<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 */

class Logger {
    private static $logFile = __DIR__ . '/../../tmp/system_logs.log';

    public static function log($message, $level = 'INFO') {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] [$level] $message" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logMessage, FILE_APPEND);
    }

    public static function error($message) {
        self::log($message, 'ERROR');
    }

    public static function warn($message) {
        self::log($message, 'WARNING');
    }

    public static function info($message) {
        self::log($message, 'INFO');
    }
    
    public static function getLogs($limit = 100) {
        if (!file_exists(self::$logFile)) return [];
        
        $lines = file(self::$logFile);
        $lines = array_reverse($lines); // Latest first
        
        return array_slice($lines, 0, $limit);
    }

    public static function clearLogs() {
        if (file_exists(self::$logFile)) {
            unlink(self::$logFile);
        }
    }
}
?>
