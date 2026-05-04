const User = require('../models/auth.model');
const Course = require('../models/course.model');
const Achievement = require('../models/achievement.model');
const Notification = require('../models/notification.model');
const Activity = require('../models/activity.model');

const dashboardController = {
    // Get dashboard overview
    getDashboardOverview: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId)
                .select('Fullname avatar bio points enrolledCourses completedCourses')
                .populate('enrolledCourses', 'title category progress')
                .populate('completedCourses', 'title category');

            // Get leaderboard data
            const leaderboard = await User.find()
                .select('Fullname points avatar')
                .sort({ points: -1 })
                .limit(10);

            res.json({
                userProfile: user,
                enrolledCourses: user.enrolledCourses,
                completedCourses: user.completedCourses,
                leaderboard
            });
        } catch (error) {
            console.error('Error in getDashboardOverview:', error);
            res.status(500).json({ message: 'Error fetching dashboard overview' });
        }
    },

    // Get user activity
    getUserActivity: async (req, res) => {
        try {
            const userId = req.user.id;
            const activities = await Activity.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json(activities);
        } catch (error) {
            console.error('Error in getUserActivity:', error);
            res.status(500).json({ message: 'Error fetching user activity' });
        }
    },

    // Get user achievements
    getUserAchievements: async (req, res) => {
        try {
            const userId = req.user.id;
            const achievements = await Achievement.find({ user: userId })
                .sort({ earnedAt: -1 });

            res.json(achievements);
        } catch (error) {
            console.error('Error in getUserAchievements:', error);
            res.status(500).json({ message: 'Error fetching user achievements' });
        }
    },

    // Get user stats
    getUserStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId)
                .select('enrolledCourses completedCourses points');

            const stats = {
                totalCourses: user.enrolledCourses.length,
                completedCourses: user.completedCourses.length,
                totalPoints: user.points,
                completionRate: user.enrolledCourses.length > 0 
                    ? (user.completedCourses.length / user.enrolledCourses.length) * 100 
                    : 0
            };

            res.json(stats);
        } catch (error) {
            console.error('Error in getUserStats:', error);
            res.status(500).json({ message: 'Error fetching user stats' });
        }
    },

    // Get user notifications
    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const notifications = await Notification.find({ user: userId, read: false })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json(notifications);
        } catch (error) {
            console.error('Error in getUserNotifications:', error);
            res.status(500).json({ message: 'Error fetching user notifications' });
        }
    },

    // Mark notification as read
    markNotificationAsRead: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const userId = req.user.id;

            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, user: userId },
                { read: true },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            res.json({ message: 'Notification marked as read' });
        } catch (error) {
            console.error('Error in markNotificationAsRead:', error);
            res.status(500).json({ message: 'Error marking notification as read' });
        }
    }
};

module.exports = dashboardController; 