<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Business Analytics Engine for Owners
 */

require_once('config.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    $businessId = $_GET['id'] ?? null;
    $range = $_GET['range'] ?? '30d'; // 7d, 30d, 90d, 1y

    if (!$businessId) {
        sendResponse(false, 'Missing business ID', null, 400);
    }

    // Security check: only owner or admin can see detailed analytics
    $stmt = $conn->prepare("SELECT owner_id FROM businesses WHERE id = ?");
    $stmt->execute([$businessId]);
    $owner = $stmt->fetch();

    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$userId]);
    $userRole = $roleStmt->fetch()['role'];

    if (!$owner || ($owner['owner_id'] !== $userId && $userRole !== 'business_owner')) {
        sendResponse(false, 'Unauthorized access to analytics', null, 403);
    }

    $days = 30;
    if ($range === '7d') $days = 7;
    elseif ($range === '90d') $days = 90;
    elseif ($range === '1y') $days = 365;

    // 1. Fetch View Trends (Daily)
    // In a real DB, we would have a table business_views (id, biz_id, date, count)
    // For now, we simulate this data returning a trend for the last X days.
    $viewTrends = [];
    for ($i = $days; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $viewTrends[] = [
            'date' => $date,
            'count' => rand(10, 100)
        ];
    }

    // 2. Lead conversion funnel (Views -> Enquiries -> Approved Leads)
    $stmt = $conn->prepare("SELECT views FROM businesses WHERE id = ?");
    $stmt->execute([$businessId]);
    $totalViews = $stmt->fetchColumn();

    $stmt = $conn->prepare("SELECT COUNT(*) FROM requests WHERE business_id = ?");
    $stmt->execute([$businessId]);
    $totalEnquiries = $stmt->fetchColumn();

    $stmt = $conn->prepare("SELECT COUNT(*) FROM requests WHERE business_id = ? AND status = 'approved'");
    $stmt->execute([$businessId]);
    $approvedLeads = $stmt->fetchColumn();

    // 3. User Demographics (Simulated based on search regions)
    $stmt = $conn->prepare("SELECT location, COUNT(*) as count FROM search_logs WHERE query LIKE (SELECT title FROM businesses WHERE id = ?) GROUP BY location ORDER BY count DESC LIMIT 5");
    $stmt->execute([$businessId]);
    $topLocations = $stmt->fetchAll();

    $analyticsResponse = [
        'businessId' => $businessId,
        'summary' => [
            'totalViews' => (int)$totalViews,
            'totalLeads' => (int)$totalEnquiries,
            'approvedLeads' => (int)$approvedLeads,
            'conversionRate' => $totalViews > 0 ? round(($totalEnquiries / $totalViews) * 100, 2) : 0
        ],
        'charts' => [
            'viewTrends' => $viewTrends,
            'leadTrends' => [
                ['name' => 'Pending', 'value' => $totalEnquiries - $approvedLeads],
                ['name' => 'Converted', 'value' => (int)$approvedLeads]
            ]
        ],
        'demographics' => [
            'topLocations' => $topLocations
        ]
    ];

    sendResponse(true, 'Analytics generated successfully', $analyticsResponse);

} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>
