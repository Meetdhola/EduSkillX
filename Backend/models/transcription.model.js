const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  videoTitle: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  pdfPath: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

module.exports = Transcription; 