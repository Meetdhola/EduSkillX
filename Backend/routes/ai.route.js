const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller.js');
const auth = require('../middleware/auth.js');

// Get AI study recommendations
router.get('/recommendations', auth, aiController.getRecommendations);

// Generate personalized learning path
router.post('/learning-path', auth, aiController.generateLearningPath);

// Fetch user learning progress
router.get('/progress', auth, aiController.getLearningProgress);

module.exports = router; 