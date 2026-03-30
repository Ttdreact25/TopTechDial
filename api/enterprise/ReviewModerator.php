<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Review Moderation Service for Content Integrity
 */

class ReviewModerator {
    private $db;
    private $profanityList = ['spam', 'fake', 'scam', 'bad', 'worst']; // Basic list

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Conduct automated moderation on a review's content
     */
    public function moderateReviewContent($content) {
        $sentiment = $this->analyzeSentiment($content);
        $isFlagged = $this->checkForProfanity($content);
        
        return [
            'is_approved' => !$isFlagged && $sentiment >= 0,
            'reason' => $isFlagged ? 'Profanity detected' : ($sentiment < 0 ? 'Highly negative sentiment' : null),
            'sentiment_score' => $sentiment
        ];
    }

    /**
     * Analyze basic sentiment based on positive/negative keywords (simplified logic)
     */
    private function analyzeSentiment($text) {
        $positiveKeywords = ['good', 'great', 'awesome', 'best', 'excellent', 'helpful', 'fast', 'recommend'];
        $negativeKeywords = ['bad', 'worst', 'scam', 'horrible', 'waste', 'cheat', 'slow', 'rude'];
        
        $text = strtolower($text);
        $words = explode(' ', $text);
        
        $score = 0;
        foreach ($words as $word) {
            $word = preg_replace('/[^a-z]/', '', $word);
            if (in_array($word, $positiveKeywords)) $score++;
            if (in_array($word, $negativeKeywords)) $score--;
        }
        
        return $score;
    }

    /**
     * Flag content containing profanity or forbidden words
     */
    private function checkForProfanity($text) {
        $text = strtolower($text);
        foreach ($this->profanityList as $word) {
            if (strpos($text, $word) !== false) return true;
        }
        return false;
    }

    /**
     * Batch process pending reviews for moderation auto-approval
     */
    public function batchModerate($reviewIds) {
        $results = [];
        foreach ($reviewIds as $id) {
            $stmt = $this->db->prepare("SELECT comment FROM reviews WHERE id = ?");
            $stmt->execute([$id]);
            $review = $stmt->fetch();
            
            if ($review) {
                $moderationResult = $this->moderateReviewContent($review['comment']);
                $newStatus = $moderationResult['is_approved'] ? 1 : 0;
                
                $stmt = $this->db->prepare("UPDATE reviews SET is_approved = ? WHERE id = ?");
                $stmt->execute([$newStatus, $id]);
                
                $results[$id] = $moderationResult;
            }
        }
        
        return $results;
    }

    /**
     * Flag users with high frequency of suspicious review activity
     */
    public function checkUserReliability($userId) {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) FROM reviews 
            WHERE user_id = ? AND is_approved = 0 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ");
        $stmt->execute([$userId]);
        $rejectedCount = $stmt->fetchColumn();

        if ($rejectedCount > 3) {
            // Highly unreliable user
            $stmt = $this->db->prepare("UPDATE users SET account_status = 'flagged' WHERE id = ?");
            $stmt->execute([$userId]);
            return false;
        }

        return true;
    }
}
?>
