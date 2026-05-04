import React from 'react';
import { motion } from 'framer-motion';
import { RiGraduationCapFill } from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A] text-white' : 'bg-[#F9FAFB] text-[#0D3B66]'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        aria-label="Toggle Theme"
      >
        {isDarkMode ? (
          <svg width="20" height="20" fill="currentColor"><path d="M10 2a1 1 0 0 1 1 1v1.07a7.002 7.002 0 0 1 5.93 5.93H18a1 1 0 1 1 0 2h-1.07a7.002 7.002 0 0 1-5.93 5.93V18a1 1 0 1 1-2 0v-1.07a7.002 7.002 0 0 1-5.93-5.93H2a1 1 0 1 1 0-2h1.07a7.002 7.002 0 0 1 5.93-5.93V3a1 1 0 0 1 1-1z"/></svg>
        ) : (
          <svg width="20" height="20" fill="currentColor"><path d="M17.293 13.293a8 8 0 1 1-10.586-10.586A8.001 8.001 0 0 0 10 18a8.001 8.001 0 0 0 7.293-4.707z"/></svg>
        )}
      </button>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-br from-[#00CFC1] via-[#007B8A] to-[#FFC857]">
            <RiGraduationCapFill className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#00CFC1] to-[#007B8A] drop-shadow-lg">
            About EduSkillX
          </h1>
        </div>
        <motion.p
          className="text-lg md:text-xl text-[#007B8A] dark:text-[#A9D6E5] mb-10 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          EduSkillX is the future of intelligent learning — empowering students with personalized insights, AI-driven assistance, and interactive learning tools.
        </motion.p>
      </div>

      {/* Sections */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Mission */}
          <motion.div
            className="bg-white/90 dark:bg-[#1B263B] p-8 rounded-2xl shadow-lg border border-[#F0F4F8] hover:border-[#00CFC1] transition"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-[#00CFC1] dark:text-[#FFC857] mb-2">🚀 Our Mission</h2>
            <p className="text-[#007B8A] dark:text-[#A9D6E5]">
              To bridge the gap between traditional learning and smart technology, enabling students to reach their full potential through innovation, interactivity, and AI.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="bg-white/90 dark:bg-[#1B263B] p-8 rounded-2xl shadow-lg border border-[#F0F4F8] hover:border-[#00CFC1] transition"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-[#00CFC1] dark:text-[#FFC857] mb-2">🧠 Smart Features</h2>
            <ul className="list-disc list-inside text-[#007B8A] dark:text-[#A9D6E5] space-y-1">
              <li>AI Chat for Instant Learning Support</li>
              <li>Student Performance Prediction using ML</li>
              <li>3D Visual Learning Tools</li>
              <li>Interactive AR/VR Classroom Modules</li>
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="bg-white/90 dark:bg-[#1B263B] p-8 rounded-2xl shadow-lg border border-[#F0F4F8] hover:border-[#00CFC1] transition"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-[#00CFC1] dark:text-[#FFC857] mb-2">🌐 Our Vision</h2>
            <p className="text-[#007B8A] dark:text-[#A9D6E5]">
              To revolutionize education with cutting-edge technology — making learning smarter, faster, and more immersive than ever before.
            </p>
          </motion.div>

          {/* Why EduSkillX */}
          <motion.div
            className="bg-white/90 dark:bg-[#1B263B] p-8 rounded-2xl shadow-lg border border-[#F0F4F8] hover:border-[#00CFC1] transition"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-[#00CFC1] dark:text-[#FFC857] mb-2">💡 Why EduSkillX?</h2>
            <p className="text-[#007B8A] dark:text-[#A9D6E5]">
              Unlike typical e-learning platforms, EduSkillX brings together AI, ML, and immersive tech to craft a dynamic learning experience that adapts to every student.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Line */}
      <motion.div
        className="text-center pb-10 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Built with ❤️ by Team EduSkillX
      </motion.div>
    </div>
  );
};

export default About;
