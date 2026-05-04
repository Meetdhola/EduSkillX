const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/adminAuth');
const opportunityController = require('../controllers/opportunity.controller');

// Get opportunities based on user's completed courses
router.get('/user', auth, opportunityController.getOpportunitiesByUser);

// Get opportunities by course ID
router.get('/course/:courseId', auth, opportunityController.getOpportunitiesByCourse);

// Get all opportunities
router.get('/', auth, opportunityController.getAllOpportunities);

// Create a new opportunity (admin only)
router.post('/', [auth, admin], opportunityController.createOpportunity);

module.exports = router; 