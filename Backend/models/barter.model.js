const mongoose = require('mongoose');

const barterProposalSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeredCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  requestedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

barterProposalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const barterChatSchema = new mongoose.Schema({
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterProposal',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BarterProposal = mongoose.model('BarterProposal', barterProposalSchema);
const BarterChat = mongoose.model('BarterChat', barterChatSchema);

module.exports = {
  BarterProposal,
  BarterChat
};