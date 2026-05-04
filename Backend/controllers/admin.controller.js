const adminService = require('../services/admin.service');
const {validationResult} = require('express-validator');

// Get all users
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
}

// Get platform activity reports
module.exports.getReports = async (req, res, next) => {
    try {
        const {startDate, endDate, type} = req.query;
        const reports = await adminService.getReports(startDate, endDate, type);
        res.status(200).json({ reports });
    } catch (error) {
        next(error);
    }
}

// Create platform content
module.exports.createContent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const content = await adminService.createContent(req.body);
        res.status(201).json({ content });
    } catch (error) {
        next(error);
    }
}

// Update platform content
module.exports.updateContent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const contentId = req.params.id;
        const content = await adminService.updateContent(contentId, req.body);
        
        if (!content) {
            return res.status(404).json({
                errors: [{
                    msg: "Content not found",
                    param: "id",
                    location: "params"
                }]
            });
        }

        res.status(200).json({ content });
    } catch (error) {
        next(error);
    }
}

// Delete platform content
module.exports.deleteContent = async (req, res, next) => {
    try {
        const contentId = req.params.id;
        const deleted = await adminService.deleteContent(contentId);
        
        if (!deleted) {
            return res.status(404).json({
                errors: [{
                    msg: "Content not found",
                    param: "id",
                    location: "params"
                }]
            });
        }

        res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        next(error);
    }
} 