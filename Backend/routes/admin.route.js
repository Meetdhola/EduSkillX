const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
// const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {body} = require('express-validator');

// Get all users
router.get('/users', [adminAuth], adminController.getAllUsers);

// Get platform activity reports
router.get('/reports', [adminAuth], adminController.getReports);

// Manage platform content
router.post('/content', [
    adminAuth,
    body('title').notEmpty().withMessage('Title is required'),
    body('type').isIn(['course', 'article', 'video']).withMessage('Invalid content type'),
    body('content').notEmpty().withMessage('Content is required')
], adminController.createContent);

router.put('/content/:id', [
    adminAuth,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('type').optional().isIn(['course', 'article', 'video']).withMessage('Invalid content type'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty')
], adminController.updateContent);

router.delete('/content/:id', [adminAuth], adminController.deleteContent);

module.exports = router; 