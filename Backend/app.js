const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db/db');
connectDB();
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const aiRoutes = require('./routes/ai.route');
const courseRoutes = require('./routes/course.route.js');
const certificateRoutes = require('./routes/certificate.route.js');
const dashboardRoutes = require('./routes/dashboard.route.js');
const assignmentRoutes = require('./routes/assignment.route.js');
const barterRoutes = require('./routes/barter.routes.js');
const adminRoutes = require('./routes/admin.route.js');
const chatRoutes = require('./routes/chat.route');
const transcriptionRoutes = require('./routes/transcription.routes');
// const skillRoutes = require('./routes/skill.route');
// const gamificationRoutes = require('./routes/gamification.route');
// const certificateRoutes = require('./routes/certificate.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/certificates', certificateRoutes);
app.use('/api', chatRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/admin', adminRoutes);
app.use('/api/barter', barterRoutes);
app.use('/api/transcriptions', transcriptionRoutes);
// app.use('/skills', skillRoutes);
// app.use('/gamification', gamificationRoutes);
// app.use('/certificates', certificateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;







