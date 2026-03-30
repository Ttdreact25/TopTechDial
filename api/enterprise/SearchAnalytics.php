<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Search Analytics & Trend Forecasting Engine
 */

class SearchAnalytics {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Conduct deep trend analysis for search keywords
     */
    public function getKeywordTrends($keyword, $days = 90) {
        $stmt = $this->db->prepare("
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM search_logs 
            WHERE query LIKE ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        ");
        
        $stmt->execute(['%' . $keyword . '%', $days]);
        $trends = $stmt->fetchAll();

        // Calculate growth percentage compared to previous period
        $prevPeriodStmt = $this->db->prepare("
            SELECT COUNT(*) 
            FROM search_logs 
            WHERE query LIKE ? 
            AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)
        ");
        
        $prevPeriodStmt->execute(['%' . $keyword . '%', $days * 2, $days]);
        $prevCount = $prevPeriodStmt->fetchColumn();
        $currCount = array_sum(array_column($trends, 'count'));

        $growth = 0;
        if ($prevCount > 0) {
            $growth = round((($currCount - $prevCount) / $prevCount) * 100, 2);
        }

        return [
            'keyword' => $keyword,
            'period_days' => $days,
            'trends' => $trends,
            'growth_rate' => $growth,
            'total_volume' => $currCount,
            'historical_volume' => $prevCount
        ];
    }

    /**
     * Identify high-demand categories without low business supply (Gaps in Market)
     */
    public function identifyServiceGaps() {
        // High search volume but low business listing count
        $stmt = $this->db->query("
            SELECT 
                category,
                COUNT(*) as search_volume,
                (SELECT COUNT(*) FROM businesses WHERE category = search_logs.category) as business_count
            FROM search_logs
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            HAVING search_volume > 100 AND business_count < 10
            ORDER BY search_volume DESC
            LIMIT 10
        ");
        
        return $stmt->fetchAll();
    }

    /**
     * Geographic distribution of demand for specific service verticals
     */
    public function getGeographicDemand($category) {
        $stmt = $this->db->prepare("
            SELECT location as city, COUNT(*) as demand_count 
            FROM search_logs 
            WHERE category = ? 
            GROUP BY location 
            ORDER BY demand_count DESC 
            LIMIT 20
        ");
        
        $stmt->execute([$category]);
        return $stmt->fetchAll();
    }

    /**
     * Aggregate search analytics overview for entire platform (Admin Dashboard)
     */
    public function getGlobalSearchOverview() {
        return [
            'most_searched_keywords' => $this->getTopN('query', 10),
            'high_demand_categories' => $this->getTopN('category', 10),
            'top_search_cities' => $this->getTopN('location', 10),
            'daily_search_average' => $this->calculateDailyAverage()
        ];
    }

    /**
     * Internal helper to fetch Top N items for a given field
     */
    private function getTopN($field, $n) {
        $stmt = $this->db->query("
            SELECT $field, COUNT(*) as count 
            FROM search_logs 
            WHERE $field IS NOT NULL AND $field != ''
            GROUP BY $field 
            ORDER BY count DESC 
            LIMIT $n
        ");
        return $stmt->fetchAll();
    }

    /**
     * Precise calculation of platform search traffic over time
     */
    private function calculateDailyAverage() {
        $stmt = $this->db->query("
            SELECT AVG(daily_count) 
            FROM (
                SELECT COUNT(*) as daily_count 
                FROM search_logs 
                GROUP BY DATE(created_at)
            ) as daily_stats
        ");
        return round($stmt->fetchColumn(), 2);
    }
}
?>
