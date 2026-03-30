<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Notification Service for Unified Platform Alerts
 */

class NotificationService {
    private $db;
    private $mailer;

    public function __construct($db, $mailer = null) {
        $this->db = $db;
        $this->mailer = $mailer;
    }

    /**
     * Internal notification entry creation
     */
    public function createNotification($userId, $title, $message, $type = 'info', $link = null) {
        $stmt = $this->db->prepare("
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $title, $message, $type, $link]);
        return $this->db->lastInsertId();
    }

    /**
     * Notify about new service request enquiry
     */
    public function notifyNewRequest($ownerId, $businessTitle, $customerName) {
        $title = "New Service Enquiry!";
        $message = "You have received a new service enquiry from $customerName for your business '$businessTitle'. Check your dashboard to respond.";
        $this->createNotification($ownerId, $title, $message, 'enquiry', '/admin/requests');
        
        // Optional dispatch email if needed
        $ownerEmailStmt = $this->db->prepare("SELECT email FROM users WHERE id = ?");
        $ownerEmailStmt->execute([$ownerId]);
        $ownerEmail = $ownerEmailStmt->fetchColumn();
        
        if ($this->mailer && $ownerEmail) {
            $this->mailer->send($ownerEmail, $title, $message);
        }
    }

    /**
     * Notify business owner when review is submitted
     */
    public function notifyNewReview($ownerId, $businessTitle, $rating) {
        $title = "New Review Received!";
        $message = "Your listing '$businessTitle' just received a $rating-star review. Check it out and respond!";
        $this->createNotification($ownerId, $title, $message, 'review', '/admin/listings');
    }

    /**
     * Alert users when a listing is (dis)approved
     */
    public function notifyListingStatusChange($userId, $businessTitle, $isApproved) {
        $statusStr = $isApproved ? 'Successfully Approved' : 'Under Major Revision Needed';
        $title = "Listing Status Update: $businessTitle";
        $message = "Your listing '$businessTitle' has been $statusStr by our moderation team.";
        $this->createNotification($userId, $title, $message, 'system_update', '/admin/listings');
    }

    /**
     * Retrieve unread notifications for currently active session
     */
    public function getMyUnreadNotifications($userId) {
        $stmt = $this->db->prepare("
            SELECT * FROM notifications 
            WHERE user_id = ? AND is_read = 0 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /**
     * Mark specific individual notification as read
     */
    public function markAsRead($notificationId, $userId) {
        $stmt = $this->db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$notificationId, $userId]);
    }

    /**
     * Purge old notifications to maintain database performance
     */
    public function purgeOldNotifications($days = 90) {
        $stmt = $this->db->prepare("DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmt->execute([$days]);
        return $stmt->rowCount();
    }
}
?>
