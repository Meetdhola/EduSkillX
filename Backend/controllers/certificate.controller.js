const certificateService = require('../services/certificate.service');
const { validationResult } = require('express-validator');

const certificateController = {
    // Create a new certificate
    createCertificate: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const certificateData = {
                user: req.body.user,
                course: req.body.course,
                issueDate: req.body.issueDate,
                grade: req.body.grade,
                score: req.body.score,
                status: req.body.status || 'active',
                expiryDate: req.body.expiryDate,
                certificateUrl: req.body.certificateUrl,
                metadata: req.body.metadata
            };

            const certificate = await certificateService.createCertificate(certificateData);
            res.status(201).json({
                message: "Certificate created successfully",
                certificate
            });
        } catch (error) {
            console.error('Create certificate error:', error);
            res.status(500).json({
                message: "Error creating certificate",
                error: error.message
            });
        }
    },

    // Get user's certificates
    getUserCertificates: async (req, res) => {
        try {
            const certificates = await certificateService.getUserCertificates(req.user._id);
            res.status(200).json({
                message: "User certificates retrieved successfully",
                certificates
            });
        } catch (error) {
            console.error('Get user certificates error:', error);
            res.status(500).json({
                message: "Error fetching user certificates",
                error: error.message
            });
        }
    },

    // Get certificate by ID
    getCertificateById: async (req, res) => {
        try {
            const certificate = await certificateService.getCertificateById(req.params.id, req.user._id);
            if (!certificate) {
                return res.status(404).json({
                    errors: [{
                        msg: "Certificate not found",
                        location: "params"
                    }]
                });
            }
            res.status(200).json({
                message: "Certificate retrieved successfully",
                certificate
            });
        } catch (error) {
            console.error('Get certificate error:', error);
            res.status(500).json({
                message: "Error fetching certificate",
                error: error.message
            });
        }
    },

    // Update certificate status
    updateCertificateStatus: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const certificate = await certificateService.updateCertificateStatus(
                req.params.id,
                req.user._id,
                req.body.status
            );

            if (!certificate) {
                return res.status(404).json({
                    errors: [{
                        msg: "Certificate not found",
                        location: "params"
                    }]
                });
            }

            res.status(200).json({
                message: "Certificate status updated successfully",
                certificate
            });
        } catch (error) {
            console.error('Update certificate status error:', error);
            res.status(500).json({
                message: "Error updating certificate status",
                error: error.message
            });
        }
    },

    // Verify certificate
    verifyCertificate: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const certificate = await certificateService.verifyCertificate(req.body.verificationCode);
            if (!certificate) {
                return res.status(404).json({
                    errors: [{
                        msg: "Certificate not found",
                        location: "body"
                    }]
                });
            }

            res.status(200).json({
                message: "Certificate verified successfully",
                certificate
            });
        } catch (error) {
            console.error('Verify certificate error:', error);
            res.status(500).json({
                message: "Error verifying certificate",
                error: error.message
            });
        }
    },

    // Get certificate statistics
    getCertificateStats: async (req, res) => {
        try {
            const stats = await certificateService.getCertificateStats(req.user._id);
            res.status(200).json({
                message: "Certificate statistics retrieved successfully",
                stats
            });
        } catch (error) {
            console.error('Get certificate statistics error:', error);
            res.status(500).json({
                message: "Error fetching certificate statistics",
                error: error.message
            });
        }
    }
};

module.exports = certificateController; 