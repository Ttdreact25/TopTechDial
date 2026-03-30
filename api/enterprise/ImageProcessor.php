<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Image Processor for Listing Media & Avatars
 */

class ImageProcessor {
    private $uploadDir;
    private $allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
    private $maxFileSize = 5242880; // 5MB

    public function __construct($uploadDir = null) {
        $this->uploadDir = $uploadDir ?: __DIR__ . '/../uploads/';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    /**
     * Process multiple uploaded images for a business listing
     */
    public function processListingImages($files, $businessId) {
        $processedUrls = [];
        $businessDir = $this->uploadDir . 'listings/business_' . $businessId . '/';
        
        if (!is_dir($businessDir)) {
            mkdir($businessDir, 0777, true);
        }

        foreach ($files['name'] as $key => $name) {
            $tmpName = $files['tmp_name'][$key];
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            
            if (in_array($ext, $this->allowedTypes) && $files['size'][$key] <= $this->maxFileSize) {
                $filename = 'img_' . time() . '_' . $key . '.' . $ext;
                $targetFile = $businessDir . $filename;
                
                if (move_uploaded_file($tmpName, $targetFile)) {
                    $processedUrls[] = $this->getPublicUrl($targetFile);
                }
            }
        }
        
        return $processedUrls;
    }

    /**
     * Handle avatar processing with circular cropping logic (simulated)
     */
    public function processAvatar($file, $userId) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $this->allowedTypes)) return false;

        $avatarDir = $this->uploadDir . 'avatars/';
        if (!is_dir($avatarDir)) mkdir($avatarDir, 0777, true);

        $filename = 'avatar_' . $userId . '_' . time() . '.' . $ext;
        $targetFile = $avatarDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            return $this->getPublicUrl($targetFile);
        }
        
        return false;
    }

    /**
     * Generate a full public URL for the file
     */
    private function getPublicUrl($localFilePath) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $scriptPath = str_replace('\\', '/', __DIR__);
        $docRoot = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
        $relativeDir = str_replace($docRoot, '', $scriptPath);
        
        // Simplified URL construction (adjust relative to project root)
        return $baseUrl . '/TopTechDial_php/TopTechDial/api/uploads/' . basename(dirname($localFilePath)) . '/' . basename($localFilePath);
    }

    /**
     * Automated cleanup of outdated images
     */
    public function cleanupOrphanedImages($activeUrls) {
        // Advanced logic would compare DB entries with disk files
        // and delete those that aren't in the DB.
        // Returning true for now.
        return true;
    }
}
?>
