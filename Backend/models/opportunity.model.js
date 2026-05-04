const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['micro-internship', 'freelancing'],
    required: true
  },
  skills: [{
    type: String
  }],
  duration: {
    type: String,
    required: true
  },
  compensation: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  applicationUrl: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity; 