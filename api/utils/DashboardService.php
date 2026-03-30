<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 */

class DashboardService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAdminStats() {
        // Total Users
        $stmt = $this->db->query("SELECT COUNT(*) FROM users");
        $totalUsers = $stmt->fetchColumn();

        // Total Businesses
        $stmt = $this->db->query("SELECT COUNT(*) FROM businesses");
        $totalBusinesses = $stmt->fetchColumn();

        // Pending Approvals
        $stmt = $this->db->query("SELECT COUNT(*) FROM businesses WHERE is_approved = 0");
        $pendingApprovals = $stmt->fetchColumn();

        // Total Reviews
        $stmt = $this->db->query("SELECT COUNT(*) FROM reviews");
        $totalReviews = $stmt->fetchColumn();

        // Growth metrics (Last 30 days)
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute();
        $newUsers = $stmt->fetchColumn();

        $stmt = $this->db->prepare("SELECT COUNT(*) FROM businesses WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute();
        $newBusinesses = $stmt->fetchColumn();

        // Daily Registration Trends (Last 7 days)
        $stmt = $this->db->query("
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        ");
        $userTrends = $stmt->fetchAll();

        // Business Category Distribution
        $stmt = $this->db->query("
            SELECT category as name, COUNT(*) as value 
            FROM businesses 
            GROUP BY category 
            ORDER BY value DESC 
            LIMIT 5
        ");
        $categoryDistribution = $stmt->fetchAll();

        return [
            'summary' => [
                'totalUsers' => (int)$totalUsers,
                'totalBusinesses' => (int)$totalBusinesses,
                'pendingApprovals' => (int)$pendingApprovals,
                'totalReviews' => (int)$totalReviews,
                'newUsers30d' => (int)$newUsers,
                'newBusinesses30d' => (int)$newBusinesses
            ],
            'charts' => [
                'userTrends' => $userTrends,
                'categoryDistribution' => $categoryDistribution
            ]
        ];
    }

    public function getClientStats($userId) {
        // Find businesses owned by this user
        $stmt = $this->db->prepare("SELECT id FROM businesses WHERE owner_id = ?");
        $stmt->execute([$userId]);
        $businessIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (empty($businessIds)) {
            return [
                'summary' => [
                    'totalBusinesses' => 0,
                    'totalViews' => 0,
                    'totalReviews' => 0,
                    'averageRating' => 0
                ],
                'businesses' => []
            ];
        }

        $idString = implode(',', array_fill(0, count($businessIds), '?'));

        // Total Views
        $stmt = $this->db->prepare("SELECT SUM(views) FROM businesses WHERE owner_id = ?");
        $stmt->execute([$userId]);
        $totalViews = $stmt->fetchColumn();

        // Total Reviews
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM reviews WHERE business_id IN ($idString)");
        $stmt->execute($businessIds);
        $totalReviews = $stmt->fetchColumn();

        // Average Rating
        $stmt = $this->db->prepare("SELECT AVG(rating) FROM reviews WHERE business_id IN ($idString)");
        $stmt->execute($businessIds);
        $averageRating = $stmt->fetchColumn();

        // Views per business trend (simplified)
        $stmt = $this->db->prepare("SELECT title, views FROM businesses WHERE owner_id = ? ORDER BY views DESC LIMIT 5");
        $stmt->execute([$userId]);
        $topPerformers = $stmt->fetchAll();

        return [
            'summary' => [
                'totalBusinesses' => count($businessIds),
                'totalViews' => (int)$totalViews,
                'totalReviews' => (int)$totalReviews,
                'averageRating' => round((float)$averageRating, 1)
            ],
            'topPerformers' => $topPerformers
        ];
    }
}
?>
