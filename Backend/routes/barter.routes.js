const express = require('express');
const router = express.Router();
const barterController = require('../controllers/barter.controller');
const authenticateToken = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all available courses for bartering
router.get('/available-courses', barterController.getAvailableCourses);

// Get all users with available courses for bartering
router.get('/users-with-courses', barterController.getUsersWithAvailableCourses);

// Get all barter proposals for the current user
router.get('/proposals', barterController.getProposals);

// Create a new barter proposal
router.post('/proposals', barterController.createProposal);

// Accept a barter proposal
router.post('/proposals/:proposalId/accept', barterController.acceptProposal);

// Reject a barter proposal
router.post('/proposals/:proposalId/reject', barterController.rejectProposal);

// Get chat messages for a proposal
router.get('/proposals/:proposalId/messages', barterController.getChatMessages);

// Send a chat message
router.post('/proposals/:proposalId/messages', barterController.sendMessage);

module.exports = router;