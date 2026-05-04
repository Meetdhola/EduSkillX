const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all chat routes
router.use(authMiddleware);

// Chat endpoints
router.post('/chat', chatController.handleChat);
router.get('/chat/history', chatController.getChatHistory);

module.exports = router; 