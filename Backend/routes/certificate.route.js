const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const certificateController = require('../controllers/certificate.controller');
const { body } = require('express-validator');

// Validation middleware
const certificateValidation = [
    body('user').isMongoId().withMessage('Invalid user ID'),
    body('course').isMongoId().withMessage('Invalid course ID'),
    body('grade').isString().withMessage('Grade must be a string'),
    body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    body('status').optional().isIn(['active', 'expired', 'revoked']).withMessage('Invalid status'),
    body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date'),
    body('certificateUrl').optional().isURL().withMessage('Invalid certificate URL')
];

const statusValidation = [
    body('status').isIn(['active', 'expired', 'revoked']).withMessage('Invalid status')
];

const verificationValidation = [
    body('verificationCode').isString().notEmpty().withMessage('Verification code is required')
];

// Routes
router.post('/', auth, certificateValidation, certificateController.createCertificate);
router.get('/user', auth, certificateController.getUserCertificates);
router.get('/:id', auth, certificateController.getCertificateById);
router.put('/:id/status', auth, statusValidation, certificateController.updateCertificateStatus);
router.post('/verify', verificationValidation, certificateController.verifyCertificate);
router.get('/stats/user', auth, certificateController.getCertificateStats);

module.exports = router; 