const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    Fullname: {
        firstname: {
            type: String,
            required: true,
            trim: true,
            minlength:[3, "First name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            minlength:[3, "Last name must be at least 3 characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength:[3, "Email must be at least 3 characters long"],
    },
    password: {
        type: String,
        required: true,
        minlength:[6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        enum: ['admin', 'instructor', 'user'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    bio: {
        type: String,
        trim: true,
        maxlength:[500, "Bio must be less than 500 characters"],
    },
    location: {
        type: String,
        trim: true,
        maxlength:[100, "Location must be less than 100 characters"],
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    completedCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        courseUpdates: {
            type: Boolean,
            default: true
        },
        assignmentReminders: {
            type: Boolean,
            default: true
        }
    },
    appearance: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        },
        highContrast: {
            type: Boolean,
            default: false
        }
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define indexes
userSchema.index({ role: 1 });
userSchema.index({ lastActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '24h' }
    );
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User; 