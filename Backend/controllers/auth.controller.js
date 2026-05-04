const userModel = require('../models/auth.model');
const userService = require('../services/auth.service');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async (req, res) => {
    try {
        const { Fullname, email, password, role, avatar } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new userModel({
            Fullname,
            email,
            password,
            role: role || 'user',
            avatar: avatar || undefined // Use provided avatar or default from schema
        });

        // Save user (password will be hashed by pre-save middleware)
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                Fullname: user.Fullname,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = user.generateAuthToken();

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                Fullname: user.Fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message:'Logged out successfully'});
    } catch (error) {
        next(error);
    }
}

// Verify email
module.exports.verifyEmail = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {email, verificationCode} = req.body;

        // TODO: Implement email verification logic
        // For now, just return success
        res.status(200).json({
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Forgot password
module.exports.forgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {email} = req.body;

        // TODO: Implement forgot password logic
        // For now, just return success
        res.status(200).json({
            message: 'Password reset instructions sent to your email'
        });
    } catch (error) {
        next(error);
    }
}

// Reset password
module.exports.resetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {token, newPassword} = req.body;

        // TODO: Implement password reset logic
        // For now, just return success
        res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
}