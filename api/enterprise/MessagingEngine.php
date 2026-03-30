<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Unified Messaging & Notification Engine for Real-Time Interaction
 */

class MessagingEngine {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Send a secure message between two users (Customer <-> Owner)
     */
    public function sendMessage($senderId, $receiverId, $businessId, $content) {
        $stmt = $this->db->prepare("
            INSERT INTO user_messages (sender_id, receiver_id, business_id, content, status, created_at)
            VALUES (?, ?, ?, ?, 'unread', NOW())
        ");
        
        if ($stmt->execute([$senderId, $receiverId, $businessId, $content])) {
            $msgId = $this->db->lastInsertId();
            $this->triggerNotification($receiverId, 'MESSAGE', 'You have a new enquiry regarding your business listing.', $msgId);
            return ['success' => true, 'id' => $msgId];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Message Persistence'];
    }

    /**
     * Fetch all conversation threads for a specific user
     */
    public function getUserThreads($userId) {
        // Complex query to group messages into conversations by business
        $stmt = $this->db->prepare("
            SELECT m.*, b.title as business_name, s.name as sender_name, r.name as receiver_name 
            FROM user_messages m
            JOIN businesses b ON m.business_id = b.id
            JOIN users s ON m.sender_id = s.id
            JOIN users r ON m.receiver_id = r.id
            WHERE (m.sender_id = ? OR m.receiver_id = ?)
            ORDER BY m.created_at DESC
        ");
        $stmt->execute([$userId, $userId]);
        $rawMessages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group by business/participant to create threads
        $threads = [];
        foreach ($rawMessages as $msg) {
             $threadKey = $msg['business_id'] . '_' . ($msg['sender_id'] == $userId ? $msg['receiver_id'] : $msg['sender_id']);
             if (!isset($threads[$threadKey])) {
                  $threads[$threadKey] = [
                       'business_id' => $msg['business_id'],
                       'business_name' => $msg['business_name'],
                       'other_party_name' => $msg['sender_id'] == $userId ? $msg['receiver_name'] : $msg['sender_name'],
                       'last_message' => $msg['content'],
                       'timestamp' => $msg['created_at'],
                       'unread_count' => ($msg['status'] == 'unread' && $msg['receiver_id'] == $userId) ? 1 : 0
                  ];
             } elseif ($msg['status'] == 'unread' && $msg['receiver_id'] == $userId) {
                  $threads[$threadKey]['unread_count']++;
             }
        }
        
        return array_values($threads);
    }

    /**
     * Mark a thread as read
     */
    public function markAsRead($userId, $otherId, $businessId) {
        $stmt = $this->db->prepare("
            UPDATE user_messages 
            SET status = 'read', updated_at = NOW() 
            WHERE receiver_id = ? AND sender_id = ? AND business_id = ? AND status = 'unread'
        ");
        return $stmt->execute([$userId, $otherId, $businessId]);
    }

    /**
     * Retrieve full chat history for a specific thread
     */
    public function getThreadHistory($userId, $otherId, $businessId) {
        $stmt = $this->db->prepare("
            SELECT m.*, u.name as sender_name 
            FROM user_messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.business_id = ? 
            AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
            ORDER BY m.created_at ASC
        ");
        $stmt->execute([$businessId, $userId, $otherId, $otherId, $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Automated system-wide notifications triggered by events
     */
    private function triggerNotification($userId, $type, $content, $refId) {
        $stmt = $this->db->prepare("
            INSERT INTO notifications (user_id, type, content, reference_id, is_read, created_at)
            VALUES (?, ?, ?, ?, 0, NOW())
        ");
        $stmt->execute([$userId, $type, $content, $refId]);
    }

    /**
     * Broadcast an announcement to all active users (Admin only)
     */
    public function broadcastAnnouncement($adminId, $content) {
        $stmt = $this->db->query("SELECT id FROM users WHERE role IN ('customer', 'owner') AND account_status = 'active'");
        $users = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($users as $userId) {
             $this->triggerNotification($userId, 'BROADCAST', $content, $adminId);
        }
    }
}
?>
