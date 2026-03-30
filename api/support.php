<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Support & Help Desk Interface API
 */

require_once('config.php');
require_once('support/SupportService.php');

$userId = verifyToken();
$method = $_SERVER['REQUEST_METHOD'];

$supportService = new SupportService($conn);

if ($method == 'GET') {
    $action = $_GET['action'] ?? null;
    $ticketId = $_GET['id'] ?? null;
    
    if ($action === 'all-tickets') {
        // Admin Only
        $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $roleStmt->execute([$userId]);
        if ($roleStmt->fetch()['role'] !== 'business_owner') {
             sendResponse(false, 'Forbidden: Admin access only.', null, 403);
        }
        $tickets = $supportService->getAllActiveTickets();
        sendResponse(true, 'System tickets retrieved', $tickets);
    } elseif ($ticketId) {
        $history = $supportService->getTicketHistory($ticketId);
        // Security: only owner or admin can see ticket history
        if ($history['ticket']['user_id'] !== $userId) {
            $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
            $roleStmt->execute([$userId]);
            if ($roleStmt->fetch()['role'] !== 'business_owner') {
                sendResponse(false, 'Unauthorized access to ticket history', null, 403);
            }
        }
        sendResponse(true, 'Ticket details retrieved', $history);
    } else {
        $myTickets = $supportService->getUserTickets($userId);
        sendResponse(true, 'Your tickets retrieved', $myTickets);
    }

} elseif ($method == 'POST') {
    $data = getJsonInput();
    $subject = $data['subject'] ?? null;
    $message = $data['message'] ?? null;
    $priority = $data['priority'] ?? 'normal';
    
    if ($subject && $message) {
        $id = $supportService->createTicket($userId, $subject, $message, $priority);
        sendResponse(true, 'Support ticket created successfully', ['ticket_id' => $id], 201);
    } else {
        sendResponse(false, 'Subject and message are required', null, 400);
    }

} elseif ($method == 'PUT') {
    $data = getJsonInput();
    $ticketId = $data['ticket_id'] ?? null;
    $message = $data['message'] ?? null;
    $action = $_GET['action'] ?? null;
    
    if ($action === 'reply') {
        if ($ticketId && $message) {
             // Check if user is admin
             $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
             $roleStmt->execute([$userId]);
             $isAdmin = $roleStmt->fetch()['role'] === 'business_owner';
             
             $supportService->addTicketReply($ticketId, $userId, $message, $isAdmin);
             sendResponse(true, 'Response successfully posted to ticket');
        } else {
             sendResponse(false, 'Missing ticket ID or reply message', null, 400);
        }
    } elseif ($action === 'close') {
        $supportService->closeTicket($ticketId, $userId);
        sendResponse(true, 'Ticket successfully closed');
    }
}
?>
