<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Master System for Client Support Ticket Management & Escalation
 */

class SupportTicketSystem {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Create a new support ticket (Customer)
     */
    public function openTicket($userId, $subject, $message, $priority = 'medium') {
        $stmt = $this->db->prepare("
            INSERT INTO support_tickets (user_id, subject, priority, status, created_at)
            VALUES (?, ?, ?, 'open', NOW())
        ");
        
        if ($stmt->execute([$userId, $subject, $priority])) {
            $ticketId = $this->db->lastInsertId();
            $this->addTicketMessage($ticketId, $userId, 'customer', $message);
            return ['success' => true, 'id' => $ticketId];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Ticket Creation'];
    }

    /**
     * Add a message thread to a ticket
     */
    public function addTicketMessage($ticketId, $actorId, $actorRole, $message) {
        $stmt = $this->db->prepare("
            INSERT INTO support_ticket_messages (ticket_id, actor_id, actor_role, message, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $success = $stmt->execute([$ticketId, $actorId, $actorRole, $message]);
        
        if ($success && $actorRole === 'staff') {
            $this->db->prepare("UPDATE support_tickets SET status = 'replied', updated_at = NOW() WHERE id = ?")->execute([$ticketId]);
        } elseif ($success && $actorRole === 'customer') {
            $this->db->prepare("UPDATE support_tickets SET status = 'open', updated_at = NOW() WHERE id = ?")->execute([$ticketId]);
        }

        return $success;
    }

    /**
     * Fetch all tickets for a specific user
     */
    public function getCustomerTickets($userId) {
        $stmt = $this->db->prepare("
            SELECT * FROM support_tickets 
            WHERE user_id = ? 
            ORDER BY updated_at DESC, created_at DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Fetch helpdesk queue (Staff / Admin)
     */
    public function getStaffQueue($status = 'all') {
        $query = "SELECT t.*, u.name as customer_name, u.email as customer_email FROM support_tickets t JOIN users u ON t.user_id = u.id";
        if ($status !== 'all') {
            $query .= " WHERE t.status = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$status]);
        } else {
            $stmt = $this->db->prepare($query);
            $stmt->execute();
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieve full thread for a ticket
     */
    public function getTicketThread($ticketId) {
        $stmt = $this->db->prepare("
            SELECT t.*, u.name as customer_name 
            FROM support_tickets t 
            JOIN users u ON t.user_id = u.id 
            WHERE t.id = ?
        ");
        $stmt->execute([$ticketId]);
        $ticket = $stmt->fetch();

        if (!$ticket) return null;

        $stmt = $this->db->prepare("
            SELECT m.*, u.name as actor_name 
            FROM support_ticket_messages m 
            LEFT JOIN users u ON m.actor_id = u.id 
            WHERE m.ticket_id = ? 
            ORDER BY m.created_at ASC
        ");
        $stmt->execute([$ticketId]);
        $messages = $stmt->fetchAll();

        return [
            'ticket' => $ticket,
            'messages' => $messages
        ];
    }

    /**
     * Close or resolve a ticket
     */
    public function closeTicket($id, $actorId, $role) {
        $stmt = $this->db->prepare("UPDATE support_tickets SET status = 'closed', updated_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Automated escalation of overdue tickets
     */
    public function processEscalations() {
        $stmt = $this->db->prepare("
            UPDATE support_tickets 
            SET priority = 'high', updated_at = NOW() 
            WHERE status != 'closed' 
            AND priority = 'medium' 
            AND created_at <= DATE_SUB(NOW(), INTERVAL 48 HOUR)
        ");
        return $stmt->execute();
    }
}
?>
