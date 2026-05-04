const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/auth.model');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// Admin analytics
router.get('/admin/analytics', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { timeRange } = req.query;
        const startDate = getStartDate(timeRange);

        const [
            totalUsers,
            totalCourses,
            totalRevenue,
            activeStudents
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Course.countDocuments(),
            Course.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$price' }
                    }
                }
            ]),
            User.countDocuments({
                role: 'user',
                lastActive: { $gte: startDate }
            })
        ]);

        res.json({
            stats: {
                totalUsers,
                totalCourses,
                totalRevenue: totalRevenue[0]?.total || 0,
                activeStudents
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Tutor analytics
router.get('/instructor/analytics', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { timeRange } = req.query;
        const startDate = getStartDate(timeRange);

        const [
            totalStudents,
            totalCourses,
            completionRate,
            averageRating
        ] = await Promise.all([
            User.countDocuments({
                role: 'user',
                enrolledCourses: { $in: await Course.find({ tutor: req.user.id }).select('_id') }
            }),
            Course.countDocuments({ tutor: req.user.id }),
            calculateCompletionRate(req.user.id, startDate),
            calculateAverageRating(req.user.id)
        ]);

        res.json({
            stats: {
                totalUsers: totalStudents,
                totalCourses,
                completionRate,
                averageRating
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Student analytics
router.get('/user/analytics', auth, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { timeRange } = req.query;
        const startDate = getStartDate(timeRange);

        const [
            totalCourses,
            totalHours,
            completionRate,
            averageScore
        ] = await Promise.all([
            Course.countDocuments({ enrolledStudents: req.user.id }),
            calculateTotalHours(req.user.id, startDate),
            calculateStudentCompletionRate(req.user.id, startDate),
            calculateAverageScore(req.user.id)
        ]);

        res.json({
            stats: {
                totalCourses,
                totalHours,
                completionRate,
                averageScore
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper functions
function getStartDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
        case 'week':
            return new Date(now.setDate(now.getDate() - 7));
        case 'month':
            return new Date(now.setMonth(now.getMonth() - 1));
        case 'year':
            return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
            return new Date(now.setDate(now.getDate() - 7));
    }
}

async function calculateCompletionRate(tutorId, startDate) {
    const assignments = await Assignment.find({
        tutor: tutorId,
        createdAt: { $gte: startDate }
    });

    if (assignments.length === 0) return 0;

    const totalSubmissions = assignments.reduce((acc, curr) => acc + curr.submissions.length, 0);
    const totalPossibleSubmissions = assignments.length * assignments[0].submissions.length;

    return Math.round((totalSubmissions / totalPossibleSubmissions) * 100);
}

async function calculateAverageRating(tutorId) {
    const courses = await Course.find({ tutor: tutorId });
    if (courses.length === 0) return 0;

    const totalRating = courses.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return totalRating / courses.length;
}

async function calculateTotalHours(studentId, startDate) {
    const assignments = await Assignment.find({
        'submissions.student': studentId,
        'submissions.submittedAt': { $gte: startDate }
    });

    return assignments.length * 2; // Assuming 2 hours per assignment
}

async function calculateStudentCompletionRate(studentId, startDate) {
    const assignments = await Assignment.find({
        'submissions.student': studentId,
        'submissions.submittedAt': { $gte: startDate }
    });

    if (assignments.length === 0) return 0;

    const totalSubmissions = assignments.length;
    const totalPossibleSubmissions = assignments.length;

    return Math.round((totalSubmissions / totalPossibleSubmissions) * 100);
}

async function calculateAverageScore(studentId) {
    const assignments = await Assignment.find({
        'submissions.student': studentId
    });

    if (assignments.length === 0) return 0;

    const totalScore = assignments.reduce((acc, curr) => {
        const submission = curr.submissions.find(sub => sub.student.toString() === studentId);
        return acc + (submission?.grade || 0);
    }, 0);

    return totalScore / assignments.length;
}

module.exports = router; 