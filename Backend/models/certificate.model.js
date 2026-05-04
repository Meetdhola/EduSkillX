const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['active', 'revoked', 'expired'],
        default: 'active'
    },
    certificateUrl: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true,
        unique: true
    },
    metadata: {
        completionDate: Date,
        completionTime: Number, // in minutes
        totalModules: Number,
        completedModules: Number,
        averageScore: Number
    }
}, {
    timestamps: true
});

// Indexes for faster queries
certificateSchema.index({ user: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ certificateId: 1 });

// Generate unique certificate ID
certificateSchema.pre('save', async function(next) {
    if (!this.certificateId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        this.certificateId = `CERT-${timestamp}-${random}`;
    }
    next();
});

// Generate verification code
certificateSchema.pre('save', async function(next) {
    if (!this.verificationCode) {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.verificationCode = `VER-${random}`;
    }
    next();
});

const certificateModel = mongoose.model('certificate', certificateSchema);

module.exports = certificateModel; 