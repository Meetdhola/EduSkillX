const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import models first
// require('./models');

// Setup required directories
const setupDirectories = require('./utils/dirSetup');
setupDirectories();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/courses', require('./routes/course.route'));
app.use('/api/dashboard', require('./routes/dashboard.route'));
app.use('/api/assignments', require('./routes/assignment.route'));
app.use('/api', require('./routes/chat.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/roadmap', require('./routes/roadmap.route'));
app.use('/api/barter', require('./routes/barter.routes'));
app.use('/api/transcriptions', require('./routes/transcription.routes'));
app.use('/api/opportunities', require('./routes/opportunity.routes'));
// app.use('/api/send-email',require('./routes/send-email.route'))
const sendEmailRoute = require('./routes/send-email.route');
app.use('/api/send-email', sendEmailRoute);


// Connect to MongoDB
const connectDB = require('./db/db');
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});