const jwt = require('jsonwebtoken');
const userModel = require('../models/auth.model');

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Received Auth Header:', authHeader); // Debug log

        if (!authHeader) {
            console.log('No Authorization header found'); // Debug log
            return res.status(401).json({
                errors: [{
                    msg: "No authentication token, access denied",
                    param: "auth",
                    location: "headers"
                }]
            });
        }

        // Check if token starts with Bearer
        if (!authHeader.startsWith('Bearer ')) {
            console.log('Invalid token format - missing Bearer prefix'); // Debug log
            return res.status(401).json({
                errors: [{
                    msg: "Invalid token format. Use 'Bearer <token>'",
                    param: "auth",
                    location: "headers"
                }]
            });
        }

        // Extract token
        const token = authHeader.replace('Bearer ', '');
        console.log('Extracted Token:', token); // Debug log

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Decoded Token:', decoded); // Debug log
            
            // Get user from database
            const user = await userModel.findById(decoded._id);
            
            if (!user) {
                console.log('User not found for token'); // Debug log
                return res.status(401).json({
                    errors: [{
                        msg: "User not found",
                        param: "auth",
                        location: "headers"
                    }]
                });
            }

            // Add user to request object
            req.user = user;
            console.log('User added to request:', req.user._id); // Debug log
            next();
        } catch (error) {
            console.error('Token verification error:', error); // Debug log
            return res.status(401).json({
                errors: [{
                    msg: "Token is invalid or expired",
                    param: "auth",
                    location: "headers"
                }]
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error); // Debug log
        next(error);
    }
};

// Optional: Add a middleware to check if user is verified
module.exports.requireVerification = async (req, res, next) => {
    try {
        if (!req.user.isVerified) {
            return res.status(403).json({
                errors: [{
                    msg: "Please verify your email first",
                    param: "verification",
                    location: "user"
                }]
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}

// Optional: Add a middleware to check user role
module.exports.checkRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    errors: [{
                        msg: "Access denied. Insufficient permissions.",
                        param: "role",
                        location: "user"
                    }]
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

// Optional: Add a middleware to check if user is active
module.exports.checkActive = async (req, res, next) => {
    try {
        if (!req.user.isActive) {
            return res.status(403).json({
                errors: [{
                    msg: "Your account has been deactivated",
                    param: "status",
                    location: "user"
                }]
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}

// Optional: Add a middleware to check if user has completed profile
module.exports.checkProfileComplete = async (req, res, next) => {
    try {
        if (!req.user.profileCompleted) {
            return res.status(403).json({
                errors: [{
                    msg: "Please complete your profile first",
                    param: "profile",
                    location: "user"
                }]
            });
        }
        next();
    } catch (error) {
        next(error);
    }
} 