const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { OpenAI } = require('openai');
const PDFDocument = require('pdfkit');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize OpenRouter client
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const openRouterBaseUrl = 'https://openrouter.ai/api/v1';

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string} - YouTube video ID
 */
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Get video title from YouTube video ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Video title
 */
const getVideoTitle = async (videoId) => {
  try {
    const response = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.data.title;
  } catch (error) {
    console.error('Error getting video title:', error);
    throw new Error('Failed to get video title');
  }
};

/**
 * Download YouTube video audio
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Path to the downloaded audio file
 */
const downloadYouTubeAudio = async (videoId) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create transcriptions directory if it doesn't exist
    const transcriptionsDir = path.join(uploadsDir, 'transcriptions');
    if (!fs.existsSync(transcriptionsDir)) {
      fs.mkdirSync(transcriptionsDir, { recursive: true });
    }

    const outputPath = path.join(transcriptionsDir, `${videoId}.mp3`);
    
    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      console.log('Audio file already exists, skipping download');
      return outputPath;
    }

    // Download audio using youtube-dl
    const command = `youtube-dl -x --audio-format mp3 -o "${outputPath}" https://www.youtube.com/watch?v=${videoId}`;
    await execAsync(command);
    
    return outputPath;
  } catch (error) {
    console.error('Error downloading YouTube audio:', error);
    throw new Error('Failed to download YouTube audio');
  }
};

/**
 * Transcribe audio using Whisper API
 * @param {string} audioPath - Path to the audio file
 * @returns {Promise<string>} - Transcription text
 */
const transcribeAudio = async (audioPath) => {
  try {
    const audioFile = fs.createReadStream(audioPath);
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    
    return response.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};

/**
 * Summarize text using OpenRouter API
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} - Summarized text
 */
const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      `${openRouterBaseUrl}/chat/completions`,
      {
        model: "anthropic/claude-3-opus-20240229",
        messages: [
          {
            role: "user",
            content: `Please summarize the following text in a concise and informative way:\n\n${text}`
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw new Error('Failed to summarize text');
  }
};

/**
 * Generate PDF from transcription and summary
 * @param {string} videoTitle - Video title
 * @param {string} transcription - Transcription text
 * @param {string} summary - Summarized text
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Path to the generated PDF
 */
const generatePDF = async (videoTitle, transcription, summary, videoId) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create pdfs directory if it doesn't exist
    const pdfsDir = path.join(uploadsDir, 'pdfs');
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir, { recursive: true });
    }

    const pdfPath = path.join(pdfsDir, `${videoId}.pdf`);
    
    // Create a PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    
    // Add content to the PDF
    doc.fontSize(20).text(videoTitle, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Summary', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(summary);
    doc.moveDown(2);
    doc.fontSize(16).text('Full Transcription', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(transcription);
    
    // Finalize the PDF
    doc.end();
    
    // Wait for the stream to finish
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(pdfPath);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Process YouTube video for transcription and summarization
 * @param {string} youtubeUrl - YouTube URL
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Transcription data
 */
const processYouTubeVideo = async (youtubeUrl, userId) => {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Get video title
    const videoTitle = await getVideoTitle(videoId);
    
    // Download audio
    const audioPath = await downloadYouTubeAudio(videoId);
    
    // Transcribe audio
    const transcription = await transcribeAudio(audioPath);
    
    // Summarize transcription
    const summary = await summarizeText(transcription);
    
    // Generate PDF
    const pdfPath = await generatePDF(videoTitle, transcription, summary, videoId);
    
    // Return transcription data
    return {
      userId,
      youtubeUrl,
      videoTitle,
      videoId,
      transcription,
      summary,
      pdfPath
    };
  } catch (error) {
    console.error('Error processing YouTube video:', error);
    throw error;
  }
};

module.exports = {
  processYouTubeVideo
}; 