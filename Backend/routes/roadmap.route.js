const express = require('express');
const router = express.Router();
const { generateRoadmap } = require('../controllers/roadmap.controller');
const auth = require('../middleware/auth');

// Generate a personalized learning roadmap
router.post('/generate', auth, generateRoadmap);

module.exports = router; 
