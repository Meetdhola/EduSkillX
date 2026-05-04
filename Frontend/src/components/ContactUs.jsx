import React from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8 text-center"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Contact <span className="text-blue-500">Us</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-gray-300 text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Have questions, feedback, or want to collaborate with us? Fill the form or reach out directly!
        </motion.p>

        {/* Form */}
        <motion.form
          className="bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="block mb-1 text-gray-400">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Message</label>
            <textarea
              placeholder="Write your message..."
              rows={5}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          className="mt-12 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Or email us at{' '}
          <a href="mailto:eduskillx.team@gmail.com" className="text-blue-400 hover:underline">
            eduskillx.team@gmail.com
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
