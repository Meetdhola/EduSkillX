const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

// Get current user's profile
router.get('/me', auth, userController.getCurrentUser);

// Get user profile by ID
router.get('/:id',auth, userController.getUserById);

// Update user profile
router.put('/update', [
    body('Fullname.firstname').optional().isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('Fullname.lastname').optional().isLength({min:3}).withMessage('Last name must be at least 3 characters long'),
    body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
    body('bio').optional().isLength({max:500}).withMessage('Bio must be less than 500 characters'),
],auth, userController.updateUserProfile);

// Upload user avatar
router.post('/avatar', auth, uploadAvatar, userController.uploadAvatar);

// Get user points and leaderboard
router.get('/:id/points',auth, userController.getUserPoints);

// Get user's certificates
router.get('/:id/certificates',auth, userController.getUserCertificates);

module.exports = router;
router.get('/:id/certificates',auth, userController.getUserCertificates);

module.exports = router;
router.get('/:id/certificates',auth, userController.getUserCertificates);

module.exports = router;