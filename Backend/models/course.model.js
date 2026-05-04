const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['arvr', 'regular'],
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    topics: [{
        title: String,
        description: String,
        duration: Number,
        content: {
            type: String,
            enum: ['video', 'ar', 'vr', 'interactive'],
            required: true
        },
        contentUrl: String
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    paidStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    completedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    progress: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    enrolledStudentsCount: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    requirements: [String],
    objectives: [String],
    thumbnail: String,
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    modules: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        duration: Number,
        videos: [{
            title: {
                type: String,
                required: true
            },
            description: String,
            youtubeId: {
                type: String,
                required: true
            },
            duration: Number,
            order: Number
        }],
        order: Number
    }],
    resources: [{
        title: String,
        description: String,
        type: String,
        url: String
    }]
}, {
    timestamps: true
});

const courseModel = mongoose.model('Course', courseSchema);

module.exports = courseModel; 