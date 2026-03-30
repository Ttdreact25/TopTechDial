<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Support Ticket & Help Desk Management
 */

class SupportService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Create a new support ticket for a user
     */
    public function createTicket($userId, $subject, $message, $priority = 'normal') {
        $ticketId = 'TTD-' . strtoupper(substr(md5(time()), 0, 8));
        
        $stmt = $this->db->prepare("
            INSERT INTO support_tickets (ticket_id, user_id, subject, initial_message, priority, status)
            VALUES (?, ?, ?, ?, ?, 'open')
        ");
        
        $stmt->execute([$ticketId, $userId, $subject, $message, $priority]);
        return $ticketId;
    }

    /**
     * Add a response/reply to an existing ticket
     */
    public function addTicketReply($ticketId, $responderId, $message, $isAdmin = false) {
        $stmt = $this->db->prepare("
            INSERT INTO support_replies (ticket_id, user_id, message, is_admin)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$ticketId, $responderId, $message, $isAdmin ? 1 : 0]);
        
        // Update ticket status to 'waiting_for_user' or 'waiting_for_admin'
        $newStatus = $isAdmin ? 'replied' : 'pending';
        $stmt = $this->db->prepare("UPDATE support_tickets SET status = ? WHERE ticket_id = ?");
        $stmt->execute([$newStatus, $ticketId]);
        
        return true;
    }

    /**
     * Retrieve all tickets assigned to a specific user
     */
    public function getUserTickets($userId) {
        $stmt = $this->db->prepare("
            SELECT * FROM support_tickets 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /**
     * Admin view: fetch all open tickets across the system
     */
    public function getAllActiveTickets() {
        $stmt = $this->db->query("
            SELECT t.*, u.name as user_name, u.email as user_email 
            FROM support_tickets t
            JOIN users u ON t.user_id = u.id
            WHERE t.status != 'closed'
            ORDER BY t.priority DESC, t.created_at ASC
        ");
        return $stmt->fetchAll();
    }

    /**
     * Get full conversation history of a ticket
     */
    public function getTicketHistory($ticketId) {
        $stmt = $this->db->prepare("SELECT * FROM support_replies WHERE ticket_id = ? ORDER BY created_at ASC");
        $stmt->execute([$ticketId]);
        $replies = $stmt->fetchAll();
        
        $stmt = $this->db->prepare("SELECT * FROM support_tickets WHERE ticket_id = ?");
        $stmt->execute([$ticketId]);
        $ticketInfo = $stmt->fetch();
        
        return [
            'ticket' => $ticketInfo,
            'replies' => $replies
        ];
    }

    /**
     * Gracefully close resolved support tickets
     */
    public function closeTicket($ticketId, $closingAdminId = null) {
        $stmt = $this->db->prepare("UPDATE support_tickets SET status = 'closed', closed_at = NOW() WHERE ticket_id = ?");
        $stmt->execute([$ticketId]);
        
        if ($closingAdminId) {
            $this->addTicketReply($ticketId, $closingAdminId, "This ticket has been marked as resolved by our support team.", true);
        }
    }
}
?>
