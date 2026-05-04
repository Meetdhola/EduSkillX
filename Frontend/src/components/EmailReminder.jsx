import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmailReminder = () => {
  const [emailData, setEmailData] = useState({
    email: '',
    type: 'assignment',
    message: ''
  });

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URI || 'http://localhost:4000'}/api/send-email`, emailData);
      alert('Reminder sent successfully!');
    } catch (err) {
      alert('Error sending email. Try again!');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl mx-auto">
        <motion.div
          className="bg-white/80 rounded-2xl shadow-md px-8 py-8 mb-8 flex flex-col items-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D3B66] mb-2 tracking-tight drop-shadow-lg text-center">
            📬 Send Email Reminder
          </h1>
          <p className="text-gray-500 text-center mb-4">
            Quickly send assignment, quiz, payment, or custom reminders to your users.
          </p>
        </motion.div>

        <form
          onSubmit={handleSend}
          className="bg-white/90 rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">User Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={emailData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Reminder Type</label>
            <select
              name="type"
              value={emailData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
            >
              <option value="assignment">📝 Assignment Reminder</option>
              <option value="quiz">📊 Quiz Reminder</option>
              <option value="payment">💳 Payment Pending</option>
              <option value="video">🎥 Lecture Video Uploaded</option>
              <option value="custom">✉️ Custom Message</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Message</label>
            <textarea
              name="message"
              rows={4}
              value={emailData.message}
              onChange={handleChange}
              placeholder="Enter custom message (optional)"
              className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
          >
            Send Email 📧
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailReminder;
