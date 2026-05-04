const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transcriptionController = require('../controllers/transcription.controller');

// Create transcription
router.post('/', auth, transcriptionController.createTranscription);

// Get user's transcriptions
router.get('/', auth, transcriptionController.getTranscriptions);

// Get a single transcription by ID
router.get('/:id', auth, transcriptionController.getTranscriptionById);

// Delete a transcription by ID
router.delete('/:id', auth, transcriptionController.deleteTranscription);

module.exports = router; 