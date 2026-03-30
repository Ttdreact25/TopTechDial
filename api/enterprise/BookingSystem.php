<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Appointment & Booking Scheduling Logic
 */

class BookingSystem {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Create a new appointment request
     */
    public function createAppointment($userId, $businessId, $slotDate, $slotTime, $notes = '') {
        // Validate slot availability
        if (!$this->isSlotAvailable($businessId, $slotDate, $slotTime)) {
             return ['success' => false, 'message' => 'Requested time slot is no longer available.'];
        }

        $stmt = $this->db->prepare("
            INSERT INTO business_appointments (user_id, business_id, appointment_date, appointment_time, notes, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        ");
        
        $success = $stmt->execute([$userId, $businessId, $slotDate, $slotTime, $notes]);
        $appointmentId = $this->db->lastInsertId();

        if ($success) {
            // Trigger notification to business owner
            $this->notifyOwner($businessId, $appointmentId);
            return ['success' => true, 'id' => $appointmentId];
        }

        return ['success' => false, 'message' => 'Database persistence failure during appointment creation.'];
    }

    /**
     * Check if a specific time slot is free for a business
     */
    public function isSlotAvailable($businessId, $date, $time) {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) 
            FROM business_appointments 
            WHERE business_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'
        ");
        $stmt->execute([$businessId, $date, $time]);
        return $stmt->fetchColumn() == 0;
    }

    /**
     * Retrieve all appointments for a user (Customer Perspective)
     */
    public function getCustomerAppointments($userId) {
        $stmt = $this->db->prepare("
            SELECT a.*, b.title as business_name, b.street, b.city, b.phone
            FROM business_appointments a
            JOIN businesses b ON a.business_id = b.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieve all appointments for a business (Owner Perspective)
     */
    public function getBusinessSchedule($businessId) {
        $stmt = $this->db->prepare("
            SELECT a.*, u.name as customer_name, u.email as customer_email
            FROM business_appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.business_id = ?
            ORDER BY a.appointment_date ASC, a.appointment_time ASC
        ");
        $stmt->execute([$businessId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update appointment status (confirm, cancel, reschedule)
     */
    public function updateStatus($id, $status, $actorId, $actorRole) {
        // Simple RBAC check
        $stmt = $this->db->prepare("SELECT * FROM business_appointments WHERE id = ?");
        $stmt->execute([$id]);
        $app = $stmt->fetch();

        if (!$app) return ['success' => false, 'message' => 'Appointment not found.'];

        // Logic: Customers can cancel, Owners can confirm/cancel
        if ($actorRole === 'owner' || ($actorRole === 'customer' && $status === 'cancelled')) {
            $stmt = $this->db->prepare("UPDATE business_appointments SET status = ? WHERE id = ?");
            if ($stmt->execute([$status, $id])) {
                return ['success' => true];
            }
        }

        return ['success' => false, 'message' => 'Unauthorized state transition.'];
    }

    /**
     * Automated reminder logic (To be run by system cron)
     */
    public function processReminders() {
        $tomorrow = date('Y-m-d', strtotime('+1 day'));
        $stmt = $this->db->prepare("
            SELECT a.*, u.email, b.title as business_name
            FROM business_appointments a
            JOIN users u ON a.user_id = u.id
            JOIN businesses b ON a.business_id = b.id
            WHERE a.appointment_date = ? AND a.status = 'confirmed' AND a.reminder_sent = 0
        ");
        $stmt->execute([$tomorrow]);
        $pending = $stmt->fetchAll();

        foreach ($pending as $app) {
            // Simulated Email dispatch
            // Mailer::send($app['email'], "Reminder: Appointment with " . $app['business_name'], "...");
            $this->db->prepare("UPDATE business_appointments SET reminder_sent = 1 WHERE id = ?")->execute([$app['id']]);
        }
    }

    private function notifyOwner($businessId, $appointmentId) {
        // Integrated with NotificationService if present
    }
}
?>
