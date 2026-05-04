const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completedTopics: [{
        topicId: String,
        completedAt: Date,
        score: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'dropped'],
        default: 'in_progress'
    },
    certificates: [{
        certificateId: String,
        issuedAt: Date,
        blockchainHash: String
    }]
}, {
    timestamps: true
});

// Compound index for unique user-course combination
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const progressModel = mongoose.model('progress', progressSchema);

module.exports = progressModel; 