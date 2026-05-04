const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Transcription = require('../models/transcription.model');
const { createPDF } = require('../utils/pdfGenerator');

const transcriptionController = {
    createTranscription: async (req, res) => {
        try {
            const { youtubeUrl, videoTitle, videoId } = req.body;
            const userId = req.user._id;

            // Extract video ID from YouTube URL if not provided
            const videoIdFromUrl = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
            const finalVideoId = videoId || videoIdFromUrl;

            if (!finalVideoId) {
                return res.status(400).json({
                    message: 'Invalid YouTube URL or video ID'
                });
            }

            // Create transcription record
            const transcription = new Transcription({
                userId,
                youtubeUrl,
                videoTitle: videoTitle || 'Untitled Video',
                videoId: finalVideoId,
                transcription: 'Processing...',
                summary: 'Processing...',
                pdfPath: ''
            });

            await transcription.save();

            // Start transcription process in background
            processTranscription(transcription._id, finalVideoId, youtubeUrl).catch(error => {
                console.error('Background transcription error:', error);
            });

            res.status(201).json({
                message: 'Transcription process started',
                data: transcription
            });
        } catch (error) {
            console.error('Create transcription error:', error);
            res.status(500).json({
                message: 'Error creating transcription',
                error: error.message
            });
        }
    },

    getTranscriptions: async (req, res) => {
        try {
            const userId = req.user._id;
            const transcriptions = await Transcription.find({ userId })
                .sort({ createdAt: -1 });

            res.json({
                message: 'Transcriptions retrieved successfully',
                data: transcriptions
            });
        } catch (error) {
            console.error('Get transcriptions error:', error);
            res.status(500).json({
                message: 'Error retrieving transcriptions',
                error: error.message
            });
        }
    },

    getTranscriptionById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const transcription = await Transcription.findOne({ _id: id, userId });

            if (!transcription) {
                return res.status(404).json({
                    message: 'Transcription not found'
                });
            }

            res.json({
                message: 'Transcription retrieved successfully',
                data: transcription
            });
        } catch (error) {
            console.error('Get transcription by ID error:', error);
            res.status(500).json({
                message: 'Error retrieving transcription',
                error: error.message
            });
        }
    },

    deleteTranscription: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const transcription = await Transcription.findOne({ _id: id, userId });

            if (!transcription) {
                return res.status(404).json({
                    message: 'Transcription not found'
                });
            }

            // Delete the PDF file if it exists
            if (transcription.pdfPath) {
                const pdfPath = path.join(__dirname, '..', transcription.pdfPath);
                
                if (fs.existsSync(pdfPath)) {
                    fs.unlinkSync(pdfPath);
                }
            }

            await Transcription.findByIdAndDelete(id);

            res.json({
                message: 'Transcription deleted successfully'
            });
        } catch (error) {
            console.error('Delete transcription error:', error);
            res.status(500).json({
                message: 'Error deleting transcription',
                error: error.message
            });
        }
    }
};

// Helper function to process transcription
async function processTranscription(transcriptionId, videoId, youtubeUrl) {
    try {
        // 1. Get transcription directly from OpenRouter
        const transcription = await getTranscriptionFromOpenRouter(youtubeUrl);

        // 2. Generate summary using OpenRouter
        const summary = await generateSummary(transcription);

        // 3. Create PDF
        const pdfPath = await createPDF(transcription, summary);

        // 4. Update transcription record
        await Transcription.findByIdAndUpdate(transcriptionId, {
            transcription,
            summary,
            pdfPath
        });
    } catch (error) {
        console.error('Process transcription error:', error);
        await Transcription.findByIdAndUpdate(transcriptionId, {
            transcription: 'Error: ' + error.message,
            summary: 'Error: ' + error.message
        });
    }
}

// Helper function to get transcription directly from OpenRouter
async function getTranscriptionFromOpenRouter(youtubeUrl) {
    try {
        // Use OpenRouter to transcribe the YouTube video
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that transcribes YouTube videos. Please transcribe the following YouTube video URL and return only the transcription text without any additional commentary or formatting.'
                    },
                    {
                        role: 'user',
                        content: `Please transcribe this YouTube video: ${youtubeUrl}`
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://eduskillx.com',
                    'X-Title': 'EduSkillX'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting transcription from OpenRouter:', error);
        throw new Error('Failed to get transcription: ' + error.message);
    }
}

// Helper function to generate summary using OpenRouter
async function generateSummary(text) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that summarizes text.'
                    },
                    {
                        role: 'user',
                        content: `Please summarize the following text:\n\n${text}`
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://eduskillx.com',
                    'X-Title': 'EduSkillX'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Generate summary error:', error);
        throw new Error('Failed to generate summary: ' + error.message);
    }
}

module.exports = transcriptionController;