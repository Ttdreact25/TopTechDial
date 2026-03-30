<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Simple Cache Manager for performance critical endpoints
 */

class CacheManager {
    private $cacheDir;
    private $expiryTime = 3600; // 1 Hour

    public function __construct($cacheDir = null) {
        $this->cacheDir = $cacheDir ?: __DIR__ . '/../../tmp/cache/';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0777, true);
        }
    }

    /**
     * Get data from cache if valid
     */
    public function get($key) {
        $cacheFile = $this->getCacheFilePath($key);
        if (file_exists($cacheFile)) {
            $data = json_decode(file_get_contents($cacheFile), true);
            if (isset($data['expiry']) && $data['expiry'] > time()) {
                return $data['content'];
            }
            // Delete expired file
            unlink($cacheFile);
        }
        return null;
    }

    /**
     * Set data into cache with specific TTL
     */
    public function set($key, $content, $ttl = null) {
        $expiry = time() + ($ttl ?: $this->expiryTime);
        $data = [
            'expiry' => $expiry,
            'content' => $content
        ];
        
        $cacheFile = $this->getCacheFilePath($key);
        return file_put_contents($cacheFile, json_encode($data));
    }

    /**
     * Delete specific cache entry
     */
    public function delete($key) {
        $cacheFile = $this->getCacheFilePath($key);
        if (file_exists($cacheFile)) {
            return unlink($cacheFile);
        }
        return false;
    }

    /**
     * Internal helper to construct cache file path
     */
    private function getCacheFilePath($key) {
        return $this->cacheDir . md5($key) . '.cache';
    }

    /**
     * Specialized cache for heavy database result sets
     */
    public function cacheDbResults($query, $params, $results, $ttl = 600) {
        $key = $query . serialize($params);
        return $this->set($key, $results, $ttl);
    }

    /**
     * Retrieve cached DB results
     */
    public function getDbResults($query, $params) {
        $key = $query . serialize($params);
        return $this->get($key);
    }

    /**
     * Purge all cache entries (Mainly for Admin use)
     */
    public function purgeAll() {
        $files = glob($this->cacheDir . '*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
        return count($files);
    }
}
?>
