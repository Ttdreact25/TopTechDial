<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level Payment & Subscription Subscription Lifecycle Bridge
 */

class PaymentBridge {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Initialize a new enterprise subscription for a business listing
     */
    public function initializeSubscription($businessId, $planId, $amount) {
        $stmt = $this->db->prepare("
            INSERT INTO business_subscriptions (business_id, plan_id, amount, status, expires_at, created_at)
            VALUES (?, ?, ?, 'pending', DATE_ADD(NOW(), INTERVAL 30 DAY), NOW())
        ");
        
        if ($stmt->execute([$businessId, $planId, $amount])) {
            return ['success' => true, 'id' => $this->db->lastInsertId()];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Subscription Initialization'];
    }

    /**
     * Process a simulated successful payment event
     */
    public function processPaymentSuccess($subscriptionId, $transactionId) {
        $stmt = $this->db->prepare("
            UPDATE business_subscriptions 
            SET status = 'active', transaction_id = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        
        if ($stmt->execute([$transactionId, $subscriptionId])) {
            // Upgrade business listing precedence globally
            $this->db->prepare("
                UPDATE businesses 
                SET is_featured = 1 
                WHERE id = (SELECT business_id FROM business_subscriptions WHERE id = ?)
            ")->execute([$subscriptionId]);
            
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'Database persistence failure during payment update.'];
    }

    /**
     * Handle automated subscription renewals (Simulated)
     */
    public function checkRenewals() {
        $stmt = $this->db->query("
            SELECT * FROM business_subscriptions 
            WHERE expires_at <= NOW() AND status = 'active'
        ");
        $expiring = $stmt->fetchAll();

        foreach ($expiring as $sub) {
             // Attempt renewal via simulated gateway
             // If successful, update expires_at
             $nextExpiry = date('Y-m-d H:i:s', strtotime('+30 days'));
             $this->db->prepare("UPDATE business_subscriptions SET expires_at = ? WHERE id = ?")->execute([$nextExpiry, $sub['id']]);
        }
    }

    /**
     * Fetch billing history for a business owner
     */
    public function getBillingRecords($ownerId) {
        $stmt = $this->db->prepare("
            SELECT s.*, b.title as business_name, b.city 
            FROM business_subscriptions s
            JOIN businesses b ON s.business_id = b.id
            WHERE b.owner_id = ? 
            ORDER BY s.created_at DESC
        ");
        $stmt->execute([$ownerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Terminate or cancel a recurring subscription
     */
    public function cancelSubscription($id) {
        $stmt = $this->db->prepare("UPDATE business_subscriptions SET status = 'cancelled', updated_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>
