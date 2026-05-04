const userModel = require('../models/auth.model');
const certificateModel = require('../models/certificate.model');

const userService = {
    // Get user by ID
    getUserById: async (userId) => {
        try {
            return await userModel.findById(userId).select('+password');
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    },

    // Update user profile
    updateUserProfile: async (userId, updateData) => {
        try {
            return await userModel
                .findByIdAndUpdate(
                    userId,
                    { $set: updateData },
                    { new: true, select: '-password' }
                );
        } catch (error) {
            throw new Error(`Error updating user profile: ${error.message}`);
        }
    },

    // Get user points and leaderboard
    getUserPoints: async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Get leaderboard (top 10 users by points)
            const leaderboard = await userModel
                .find()
                .sort({ points: -1 })
                .limit(10)
                .select('Fullname points');

            return {
                userPoints: user.points || 0,
                leaderboard
            };
        } catch (error) {
            throw new Error(`Error fetching user points: ${error.message}`);
        }
    },

    // Get user certificates
    getUserCertificates: async (userId) => {
        try {
            return await certificateModel
                .find({ user: userId })
                .populate('course', 'title description thumbnail')
                .sort({ issueDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching user certificates: ${error.message}`);
        }
    },

    // Get user statistics
    getUserStats: async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Get certificate statistics
            const certificates = await certificateModel.find({ user: userId });
            const certificateStats = {
                total: certificates.length,
                active: certificates.filter(cert => cert.status === 'active').length,
                averageScore: certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length || 0
            };

            // Get enrolled courses
            const enrolledCourses = await userModel
                .findById(userId)
                .populate('enrolledCourses');

            return {
                profile: {
                    Fullname: user.Fullname,
                    email: user.email,
                    role: user.role,
                    points: user.points || 0
                },
                certificates: certificateStats,
                enrolledCourses: enrolledCourses.enrolledCourses.length
            };
        } catch (error) {
            throw new Error(`Error fetching user statistics: ${error.message}`);
        }
    },

    // Update user points
    updateUserPoints: async (userId, points) => {
        try {
            return await userModel
                .findByIdAndUpdate(
                    userId,
                    { $inc: { points } },
                    { new: true, select: '-password' }
                );
        } catch (error) {
            throw new Error(`Error updating user points: ${error.message}`);
        }
    },

    // Get user achievements
    getUserAchievements: async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const certificates = await certificateModel.find({ user: userId });
            
            const achievements = {
                totalCertificates: certificates.length,
                topGrades: certificates.filter(cert => ['A+', 'A'].includes(cert.grade)).length,
                perfectScores: certificates.filter(cert => cert.score === 100).length,
                consecutiveDays: user.consecutiveDays || 0,
                totalPoints: user.points || 0
            };

            return achievements;
        } catch (error) {
            throw new Error(`Error fetching user achievements: ${error.message}`);
        }
    },

    // Update user avatar
    updateUserAvatar: async (userId, avatarUrl) => {
        try {
            const updatedUser = await userModel
                .findByIdAndUpdate(
                    userId,
                    { avatar: avatarUrl },
                    { new: true, select: '-password' }
                );
            
            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user avatar: ${error.message}`);
        }
    }
};

module.exports = userService; 