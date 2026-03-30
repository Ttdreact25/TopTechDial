<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level User Profile & Preference Engine for Personalized Discovery
 */

class ProfileEngine {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Update dynamic user preferences for search and notifications
     */
    public function updatePreferences($userId, $prefs) {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET preferences = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        
        $jsonPrefs = json_encode($prefs);
        if ($stmt->execute([$jsonPrefs, $userId])) {
            $this->logActivity('PREFS_UPDATE', $userId, 'User updated search and notification preferences.');
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Preference Persistence'];
    }

    /**
     * Fetch all profile metadata including activity statistics
     */
    public function getFullProfile($userId) {
        $stmt = $this->db->prepare("
            SELECT u.*, 
            (SELECT COUNT(*) FROM search_logs WHERE user_id = u.id) as total_searches,
            (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as total_reviews,
            (SELECT COUNT(*) FROM business_appointments WHERE user_id = u.id) as total_appointments
            FROM users u 
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
             unset($user['password']); // Protect sensitive credentials
        }
        
        return $user;
    }

    /**
     * Personalize discovery results based on user historical patterns
     */
    public function getPersonalizedSuggestions($userId) {
        // Find most frequent category from search logs
        $stmt = $this->db->prepare("
            SELECT category, COUNT(*) as cat_count 
            FROM search_logs 
            WHERE user_id = ? AND category IS NOT NULL 
            GROUP BY category 
            ORDER BY cat_count DESC 
            LIMIT 1
        ");
        $stmt->execute([$userId]);
        $favCat = $stmt->fetchColumn();

        if ($favCat) {
             $stmt = $this->db->prepare("
                SELECT title, category, city, average_rating 
                FROM businesses 
                WHERE category = ? AND is_approved = 1 
                ORDER BY average_rating DESC 
                LIMIT 5
             ");
             $stmt->execute([$favCat]);
             return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return [];
    }

    /**
     * Track sensitive user interactions for profiling & analytics
     */
    private function logActivity($type, $userId, $details) {
        $stmt = $this->db->prepare("
            INSERT INTO system_audit_logs (event_type, actor_id, details, created_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$type, $userId, $details]);
    }
}
?>
