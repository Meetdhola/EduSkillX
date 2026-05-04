const certificateModel = require('../models/certificate.model');

const certificateService = {
    // Create a new certificate
    createCertificate: async (certificateData) => {
        try {
            const certificate = new certificateModel(certificateData);
            await certificate.save();
            return certificate;
        } catch (error) {
            throw new Error(`Error creating certificate: ${error.message}`);
        }
    },

    // Get all certificates for a user
    getUserCertificates: async (userId) => {
        try {
            return await certificateModel
                .find({ user: userId })
                .populate('course', 'title description thumbnail')
                .sort({ issueDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching user certificates: ${error.message}`);
        }
    },

    // Get a specific certificate by ID
    getCertificateById: async (certificateId, userId) => {
        try {
            return await certificateModel
                .findOne({ _id: certificateId, user: userId })
                .populate('course', 'title description thumbnail');
        } catch (error) {
            throw new Error(`Error fetching certificate: ${error.message}`);
        }
    },

    // Update certificate status
    updateCertificateStatus: async (certificateId, userId, status) => {
        try {
            return await certificateModel.findOneAndUpdate(
                { _id: certificateId, user: userId },
                { status },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating certificate status: ${error.message}`);
        }
    },

    // Verify certificate by verification code
    verifyCertificate: async (verificationCode) => {
        try {
            return await certificateModel
                .findOne({ verificationCode })
                .populate('course', 'title description thumbnail')
                .populate('user', 'Fullname email');
        } catch (error) {
            throw new Error(`Error verifying certificate: ${error.message}`);
        }
    },

    // Get certificate statistics
    getCertificateStats: async (userId) => {
        try {
            const certificates = await certificateModel.find({ user: userId });
            
            const stats = {
                totalCertificates: certificates.length,
                activeCertificates: certificates.filter(cert => cert.status === 'active').length,
                averageScore: certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length,
                gradeDistribution: certificates.reduce((acc, cert) => {
                    acc[cert.grade] = (acc[cert.grade] || 0) + 1;
                    return acc;
                }, {})
            };

            return stats;
        } catch (error) {
            throw new Error(`Error fetching certificate statistics: ${error.message}`);
        }
    }
};

module.exports = certificateService; 