const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completedTopics: [{
        topicId: String,
        title: String,
        completedAt: Date,
        score: Number
    }],
    currentStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: Date.now
    },
    learningPath: [{
        week: Number,
        topics: [String],
        goals: [String],
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        }
    }]
}, {
    timestamps: true
});

const learningProgressModel = mongoose.model('learningProgress', learningProgressSchema);

module.exports = learningProgressModel; 