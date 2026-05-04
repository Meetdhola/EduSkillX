const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/auth');

// Apply authentication middleware to all dashboard routes
router.use(authenticateToken);

// Dashboard overview
router.get('/overview', dashboardController.getDashboardOverview);

// User activity
router.get('/activity', dashboardController.getUserActivity);

// User achievements
router.get('/achievements', dashboardController.getUserAchievements);

// User stats
router.get('/stats', dashboardController.getUserStats);

// User notifications
router.get('/notifications', dashboardController.getUserNotifications);
router.put('/notifications/:notificationId/read', dashboardController.markNotificationAsRead);

module.exports = router; 