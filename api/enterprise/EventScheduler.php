<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Unified Social & Enterprise Event Scheduler for Networking
 */

class EventScheduler {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Schedule a new enterprise networking event for listings
     */
    public function scheduleEvent($businessId, $title, $description, $location, $eventDate, $capacity = 100) {
        $stmt = $this->db->prepare("
            INSERT INTO enterprise_events (business_id, title, description, location, event_date, capacity, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'upcoming', NOW())
        ");
        
        if ($stmt->execute([$businessId, $title, $description, $location, $eventDate, $capacity])) {
            return ['success' => true, 'id' => $this->db->lastInsertId()];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Event Persistence'];
    }

    /**
     * Register a user for an enterprise event
     */
    public function registerUserForEvent($userId, $eventId) {
        // Check capacity
        $stmt = $this->db->prepare("
            SELECT COUNT(*) 
            FROM event_registrations 
            WHERE event_id = ?
        ");
        $stmt->execute([$eventId]);
        $currentCount = $stmt->fetchColumn();

        $stmt = $this->db->prepare("SELECT capacity FROM enterprise_events WHERE id = ?");
        $stmt->execute([$eventId]);
        $capacity = $stmt->fetchColumn();

        if ($currentCount >= $capacity) {
             return ['success' => false, 'message' => 'Event capacity has been reached.'];
        }

        $stmt = $this->db->prepare("
            INSERT INTO event_registrations (user_id, event_id, status, created_at)
            VALUES (?, ?, 'registered', NOW())
        ");
        
        if ($stmt->execute([$userId, $eventId])) {
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'Database persistence failure during event registration.'];
    }

    /**
     * Fetch upcoming networking events with filtering
     */
    public function getUpcomingEvents($location = 'all', $limit = 10) {
        $query = "SELECT e.*, b.title as business_name FROM enterprise_events e JOIN businesses b ON e.business_id = b.id WHERE e.event_date >= NOW() AND e.status = 'upcoming'";
        if ($location !== 'all') {
            $query .= " AND e.location = ?";
            $stmt = $this->db->prepare($query . " ORDER BY e.event_date ASC LIMIT ?");
            $stmt->execute([$location, (int)$limit]);
        } else {
            $stmt = $this->db->prepare($query . " ORDER BY e.event_date ASC LIMIT ?");
            $stmt->execute([(int)$limit]);
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Cancel an upcoming event (Owner only)
     */
    public function cancelEvent($eventId, $businessId) {
        $stmt = $this->db->prepare("UPDATE enterprise_events SET status = 'cancelled', updated_at = NOW() WHERE id = ? AND business_id = ?");
        return $stmt->execute([$eventId, $businessId]);
    }

    /**
     * Fetch event attendee list for the organizer
     */
    public function getAttendeeList($eventId) {
        $stmt = $this->db->prepare("
            SELECT r.*, u.name as attendee_name, u.email as attendee_email 
            FROM event_registrations r
            JOIN users u ON r.user_id = u.id
            WHERE r.event_id = ?
        ");
        $stmt->execute([$eventId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Automated housekeeping for past events
     */
    public function archivePastEvents() {
        $stmt = $this->db->prepare("
            UPDATE enterprise_events 
            SET status = 'past', updated_at = NOW() 
            WHERE event_date < NOW() AND status = 'upcoming'
        ");
        return $stmt->execute();
    }
}
?>
