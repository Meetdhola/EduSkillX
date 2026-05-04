const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Example route
router.post('/', async (req, res) => {
  const { email, type, message } = req.body;

  try {
    require('dotenv').config(); // Must be at the top

// const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `EduSkillX: ${type} Reminder`,
      text: message || `This is a friendly reminder regarding your ${type}.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reminder email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
