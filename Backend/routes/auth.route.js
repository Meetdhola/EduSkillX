const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/auth.controller');

// Register new user
router.post('/register',[
    body('Fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('Fullname.lastname').isLength({min:3}).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is required'),
    body('role').isIn(['admin','user','instructor']).withMessage('Role is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
], authController.registerUser);

// Login user
router.post('/login',[
    body('email').isEmail().withMessage('Email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
], authController.loginUser); 

// Logout user
router.post('/logout', authController.logoutUser);   

// Verify email
router.post('/verify-email', [
    body('email').isEmail().withMessage('Email is required'),
    body('verificationCode').isLength({min:6}).withMessage('Verification code is required'),
], authController.verifyEmail);

// Forgot password
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Email is required'),
], authController.forgotPassword);

// Reset password
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({min:6}).withMessage('New password must be at least 6 characters long'),
], authController.resetPassword);

module.exports = router;