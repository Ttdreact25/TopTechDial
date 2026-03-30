<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Automated Report Scheduler & Dispatcher
 */

class ReportScheduler {
    private $db;
    private $mailer;

    public function __construct($db, $mailer) {
        $this->db = $db;
        $this->mailer = $mailer;
    }

    /**
     * Schedule a recurring report for a specific business owner
     */
    public function scheduleBusinessReport($userId, $businessId, $frequency = 'weekly') {
        $stmt = $this->db->prepare("
            INSERT INTO report_schedules (user_id, business_id, frequency, next_run)
            VALUES (?, ?, ?, ?)
        ");
        
        $nextRun = date('Y-m-d H:i:s', strtotime("+1 " . $frequency));
        $stmt->execute([$userId, $businessId, $frequency, $nextRun]);
        
        return $this->db->lastInsertId();
    }

    /**
     * System Cron: Process all pending scheduled reports
     */
    public function processScheduledQueue() {
        $stmt = $this->db->query("
            SELECT s.*, u.email, b.title as business_title 
            FROM report_schedules s
            JOIN users u ON s.user_id = u.id
            JOIN businesses b ON s.business_id = b.id
            WHERE s.next_run <= NOW() AND s.is_active = 1
        ");
        
        $queue = $stmt->fetchAll();
        $processedCount = 0;

        require_once('ReportGenerator.php');
        $generator = new ReportGenerator($this->db);

        foreach ($queue as $item) {
            $report = $generator->generateBusinessLeadReport($item['business_id']);
            $subject = "Performance Report: " . $item['business_title'];
            $body = "Your " . $item['frequency'] . " performance summary for " . $item['business_title'] . " is ready.";
            
            // Dispatch email via Mailer
            if ($this->mailer->send($item['email'], $subject, $body)) {
                // Update next run time
                $nextRun = date('Y-m-d H:i:s', strtotime("+1 " . $item['frequency']));
                $updateStmt = $this->db->prepare("UPDATE report_schedules SET next_run = ?, last_run = NOW() WHERE id = ?");
                $updateStmt->execute([$nextRun, $item['id']]);
                $processedCount++;
            }
        }
        
        return $processedCount;
    }

    /**
     * Audit recently dispatched report logs
     */
    public function getReportHistory($userId) {
        $stmt = $this->db->prepare("
            SELECT * FROM report_schedules 
            WHERE user_id = ? 
            ORDER BY last_run DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /**
     * Deactivate a specific report schedule
     */
    public function toggleSchedule($id, $isActive) {
        $stmt = $this->db->prepare("UPDATE report_schedules SET is_active = ? WHERE id = ?");
        $stmt->execute([$isActive ? 1 : 0, $id]);
    }
}
?>
