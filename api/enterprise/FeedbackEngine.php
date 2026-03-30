<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level User Feedback & Community Review Engine
 */

class FeedbackEngine {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Submit a detailed user experience feedback for a listing
     */
    public function submitDetailedReview($userId, $businessId, $rating, $comment, $sentiment = 'neutral') {
        // Enforce moderation queue
        $stmt = $this->db->prepare("
            INSERT INTO reviews (user_id, business_id, rating, comment, sentiment_score, is_approved, created_at)
            VALUES (?, ?, ?, ?, ?, 0, NOW())
        ");
        
        $success = $stmt->execute([$userId, $businessId, $rating, $comment, $sentiment]);
        $reviewId = $this->db->lastInsertId();

        if ($success) {
            $this->logActivity('REVIEW_SUBMITTED', $userId, 'User submitted feedback for listing UID ' . $businessId, $reviewId);
            return ['success' => true, 'id' => $reviewId];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Review Persistence'];
    }

    /**
     * Fetch all reviews for a listing with filtering and pagination
     */
    public function getListingReviews($businessId, $status = 'approved', $limit = 10) {
        $query = "SELECT r.*, u.name as reviewer_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.business_id = ?";
        if ($status !== 'all') {
            $query .= " AND r.is_approved = ?";
            $stmt = $this->db->prepare($query . " ORDER BY r.created_at DESC LIMIT ?");
            $stmt->execute([$businessId, ($status === 'approved' ? 1 : 0), (int)$limit]);
        } else {
            $stmt = $this->db->prepare($query . " ORDER BY r.created_at DESC LIMIT ?");
            $stmt->execute([$businessId, (int)$limit]);
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Moderate or Approve a user review
     */
    public function moderateReview($reviewId, $approve = true, $adminId) {
        $stmt = $this->db->prepare("UPDATE reviews SET is_approved = ?, updated_at = NOW() WHERE id = ?");
        $success = $stmt->execute([($approve ? 1 : -1), $reviewId]);
        
        if ($success && $approve) {
             // Re-calculate business average rating
             $revStmt = $this->db->prepare("SELECT business_id FROM reviews WHERE id = ?");
             $revStmt->execute([$reviewId]);
             $bizId = $revStmt->fetchColumn();
             $this->recalculateBusinessRating($bizId);
        }

        return $success;
    }

    /**
     * Internal logic for weighted average rating calculation
     */
    private function recalculateBusinessRating($businessId) {
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as average, COUNT(*) as count 
            FROM reviews 
            WHERE business_id = ? AND is_approved = 1
        ");
        $stmt->execute([$businessId]);
        $stats = $stmt->fetch();

        $updateStmt = $this->db->prepare("
            UPDATE businesses 
            SET average_rating = ?, review_count = ? 
            WHERE id = ?
        ");
        $updateStmt->execute([round($stats['average'] ?? 0, 2), $stats['count'], $businessId]);
    }

    /**
     * Automated sentiment discovery (Simulated)
     */
    public function analyzeSentiment($reviewId) {
        $stmt = $this->db->prepare("SELECT comment FROM reviews WHERE id = ?");
        $stmt->execute([$reviewId]);
        $comment = $stmt->fetchColumn();

        $positiveWords = ['excellent', 'great', 'fast', 'pro', 'elite', 'best', 'verified', 'amazing'];
        $negativeWords = ['bad', 'slow', 'fake', 'poor', 'fraud', 'worst', 'scam', 'untrustworthy'];

        $score = 0;
        foreach ($positiveWords as $pw) if (stripos($comment, $pw) !== false) $score++;
        foreach ($negativeWords as $nw) if (stripos($comment, $nw) !== false) $score--;

        $sentiment = ($score > 0) ? 'positive' : (($score < 0) ? 'negative' : 'neutral');
        $this->db->prepare("UPDATE reviews SET sentiment_score = ? WHERE id = ?")->execute([$sentiment, $reviewId]);
        
        return $sentiment;
    }

    /**
     * Track user activity for system-wide auditing
     */
    private function logActivity($type, $userId, $details, $refId) {
        $stmt = $this->db->prepare("
            INSERT INTO system_audit_logs (event_type, actor_id, details, target_id, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$type, $userId, $details, $refId]);
    }
}
?>
