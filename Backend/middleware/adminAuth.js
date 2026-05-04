const jwt = require('jsonwebtoken');
const userModel = require('../models/auth.model');

module.exports = async (req, res, next) => {
    try {
        // Check for token in different locations
        let token = null;

        // 1. Check Authorization header (Bearer token)
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
        }

        // 2. Check cookies if no bearer token found
        if (!token && req.cookies) {
            token = req.cookies.adminToken;
        }

        if (!token) {
            return res.status(401).json({
                errors: [{
                    msg: "No authentication token found. Please login as admin.",
                    param: "auth",
                    location: "headers"
                }]
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            // Get user from database
            const user = await userModel.findById(decoded._id);
            
            if (!user || user.role !== 'admin') {
                return res.status(403).json({
                    errors: [{
                        msg: "Access denied. Admin privileges required.",
                        param: "role",
                        location: "user"
                    }]
                });
            }

            // Add admin user to request object
            req.admin = user;
            next();
        } catch (error) {
            return res.status(401).json({
                errors: [{
                    msg: "Invalid or expired authentication token",
                    param: "auth",
                    location: "headers"
                }]
            });
        }
    } catch (error) {
        next(error);
    }
}

// Check for specific admin permissions
module.exports.checkAdminPermission = (requiredPermissions) => {
    return (req, res, next) => {
        try {
            if (!req.admin || !req.admin.permissions) {
                return res.status(403).json({
                    errors: [{
                        msg: "Admin permissions not found",
                        param: "permissions",
                        location: "user"
                    }]
                });
            }

            const hasAllPermissions = requiredPermissions.every(permission => 
                req.admin.permissions.includes(permission)
            );

            if (!hasAllPermissions) {
                return res.status(403).json({
                    errors: [{
                        msg: "Insufficient admin permissions",
                        param: "permissions",
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