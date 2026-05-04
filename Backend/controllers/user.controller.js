const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

const userController = {
    // Get current user's profile
    getCurrentUser: async (req, res) => {
        try {
            const user = await userService.getUserById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    errors: [{
                        msg: "User not found",
                        location: "params"
                    }]
                });
            }
            res.status(200).json({
                message: "User retrieved successfully",
                user
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                message: "Error fetching user",
                error: error.message
            });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    errors: [{
                        msg: "User not found",
                        location: "params"
                    }]
                });
            }
            res.status(200).json({
                message: "User retrieved successfully",
                user
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                message: "Error fetching user",
                error: error.message
            });
        }
    },

    // Update user profile
    updateUserProfile: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await userService.updateUserProfile(req.user._id, req.body);
            res.status(200).json({
                message: "User profile updated successfully",
                user
            });
        } catch (error) {
            console.error('Update user profile error:', error);
            res.status(500).json({
                message: "Error updating user profile",
                error: error.message
            });
        }
    },

    // Get user points and leaderboard
    getUserPoints: async (req, res) => {
        try {
            const pointsData = await userService.getUserPoints(req.params.id);
            res.status(200).json({
                message: "User points retrieved successfully",
                ...pointsData
            });
        } catch (error) {
            console.error('Get user points error:', error);
            res.status(500).json({
                message: "Error fetching user points",
                error: error.message
            });
        }
    },

    // Get user certificates
    getUserCertificates: async (req, res) => {
        try {
            const certificates = await userService.getUserCertificates(req.params.id);
            res.status(200).json({
                message: "User certificates retrieved successfully",
                certificates
            });
        } catch (error) {
            console.error('Get user certificates error:', error);
            res.status(500).json({
                message: "Error fetching user certificates",
                error: error.message
            });
        }
    },

    // Get user statistics
    getUserStats: async (req, res) => {
        try {
            const stats = await userService.getUserStats(req.user._id);
            res.status(200).json({
                message: "User statistics retrieved successfully",
                ...stats
            });
        } catch (error) {
            console.error('Get user statistics error:', error);
            res.status(500).json({
                message: "Error fetching user statistics",
                error: error.message
            });
        }
    },

    // Get user achievements
    getUserAchievements: async (req, res) => {
        try {
            const achievements = await userService.getUserAchievements(req.user._id);
            res.status(200).json({
                message: "User achievements retrieved successfully",
                achievements
            });
        } catch (error) {
            console.error('Get user achievements error:', error);
            res.status(500).json({
                message: "Error fetching user achievements",
                error: error.message
            });
        }
    },

    // Upload user avatar
    uploadAvatar: async (req, res) => {
        try {
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            // Create the URL for the uploaded file
            const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
            const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;
            
            // Update user's avatar in the database
            const updatedUser = await userService.updateUserAvatar(req.user._id, avatarUrl);
            
            res.status(200).json({
                message: "Avatar uploaded successfully",
                user: updatedUser
            });
        } catch (error) {
            console.error('Upload avatar error:', error);
            res.status(500).json({
                message: "Error uploading avatar",
                error: error.message
            });
        }
    }
};

module.exports = userController;