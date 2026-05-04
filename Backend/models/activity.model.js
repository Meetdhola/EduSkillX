const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        enum: [
            'login',
            'register',
            'course_start',
            'course_complete',
            'content_view',
            'content_create',
            'content_update',
            'content_delete',
            'comment',
            'like'
        ],
        required: true
    },
    details: {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'content'
        },
        duration: Number, // for course completion
        score: Number, // for course completion
        metadata: mongoose.Schema.Types.Mixed // for additional activity-specific data
    },
    ip: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    error: String // for failed activities
}, {
    timestamps: true
});

// Index for efficient querying
activitySchema.index({ userId: 1, type: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

const activityModel = mongoose.model('activity', activitySchema);

module.exports = activityModel; 