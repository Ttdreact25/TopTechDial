<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Report Generator for Platform Analytics
 */

class ReportGenerator {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Generate a comprehensive CSV report for all business listings
     */
    public function generateBusinessInventoryReport() {
        $stmt = $this->db->query("
            SELECT 
                b.id, b.title, b.category, b.city, b.state, b.is_approved, b.views, b.average_rating, b.review_count,
                u.name as owner_name, u.email as owner_email, b.created_at
            FROM businesses b
            JOIN users u ON b.owner_id = u.id
            ORDER BY b.created_at DESC
        ");
        $results = $stmt->fetchAll();

        $filename = "business_inventory_" . date('Y-m-d') . ".csv";
        $header = ['ID', 'Title', 'Category', 'City', 'State', 'Status', 'Views', 'Rating', 'Reviews', 'Owner Name', 'Owner Email', 'Date Created'];
        
        $csv = $this->createCsvData($header, $results);
        return ['filename' => $filename, 'data' => $csv];
    }

    /**
     * Generate an analytics report focusing on user engagement
     */
    public function generateEngagementReport($days = 30) {
        // Search Statistics
        $stmt = $this->db->prepare("
            SELECT query, category, location, COUNT(*) as count 
            FROM search_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY query, category, location
            ORDER BY count DESC 
            LIMIT 50
        ");
        $stmt->execute([$days]);
        $searchStats = $stmt->fetchAll();

        // Review Activity
        $stmt = $this->db->prepare("
            SELECT rating, COUNT(*) as count 
            FROM reviews 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY rating
            ORDER BY rating DESC
        ");
        $stmt->execute([$days]);
        $reviewStats = $stmt->fetchAll();

        return [
            'period_days' => $days,
            'top_searches' => $searchStats,
            'review_distribution' => $reviewStats,
            'generated_at' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Generate a detailed lead conversion report for a specific business
     */
    public function generateBusinessLeadReport($businessId) {
        // Lead data from requests table
        $stmt = $this->db->prepare("
            SELECT 
                r.user_name, r.user_email, r.user_phone, r.message, r.status, r.created_at
            FROM requests r
            WHERE r.business_id = ?
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$businessId]);
        $leads = $stmt->fetchAll();

        // Summary stats
        $stmt = $this->db->prepare("SELECT title FROM businesses WHERE id = ?");
        $stmt->execute([$businessId]);
        $businessInfo = $stmt->fetch();

        $summary = [
            'total_leads' => count($leads),
            'pending_leads' => count(array_filter($leads, function($l) { return $l['status'] == 'pending'; })),
            'converted_leads' => count(array_filter($leads, function($l) { return $l['status'] == 'approved'; }))
        ];

        return [
            'business' => $businessInfo['title'],
            'summary' => $summary,
            'leads' => $leads
        ];
    }

    /**
     * Internal helper to format CSV data
     */
    private function createCsvData($header, $rows) {
        $output = fopen('php://temp', 'r+');
        fputcsv($output, $header);
        foreach ($rows as $row) {
            fputcsv($output, array_values($row));
        }
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        return $csv;
    }

    /**
     * Export all system logs for auditing
     */
    public function exportSystemAuditLogs() {
        $stmt = $this->db->prepare("SELECT * FROM search_logs ORDER BY created_at DESC LIMIT 5000");
        $stmt->execute();
        $logs = $stmt->fetchAll();

        $header = ['ID', 'User ID', 'Query', 'Category', 'Location', 'User IP', 'Created At'];
        $filename = "audit_log_" . date('Y-m-d_H-i-s') . ".csv";
        
        $csvData = $this->createCsvData($header, $logs);
        return ['filename' => $filename, 'data' => $csvData];
    }
}
?>
