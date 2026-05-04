import React from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
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
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 top-0 backdrop-blur-md ${isDarkMode ? 'bg-[#14213D]/80 border-b border-[#1B263B]' : 'bg-white/80 border-b border-[#E5E7EB]'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] rounded-full shadow">
              <RiGraduationCapFill className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#00CFC1] to-[#007B8A]">EduSkillX</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Courses', 'Roadmap', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-[#00CFC1] font-medium transition-all duration-200"
              >
                {item}
              </Link>
            ))}
            <Link to="/login" className="text-sm hover:text-[#00CFC1] transition">Sign In</Link>
            <Link to="/signup" className="ml-2 px-5 py-2 text-white bg-gradient-to-r from-[#00CFC1] to-[#007B8A] hover:scale-105 rounded-full shadow transition">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-[#00CFC1] opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#007B8A] opacity-20 blur-3xl rounded-full"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-[#00CFC1] via-[#007B8A] to-[#FFC857] text-transparent bg-clip-text">
            Empower Your Skills with EduSkillX
          </h1>
          <p className="text-lg md:text-xl text-[#007B8A] dark:text-[#A9D6E5] mb-10">
            Build your future with practical learning and community-driven mentorship.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/signup" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white font-semibold shadow-lg hover:scale-105 transition-transform">Start Learning</Link>
            <Link to="/courses" className={`px-6 py-3 rounded-xl border font-semibold transition-colors ${isDarkMode ? 'border-[#1B263B] hover:bg-[#14213D]' : 'border-[#E5E7EB] hover:bg-[#F0F4F8]'}`}>Explore Courses</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-32 my-[8vh] px-4 ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: 'Interactive Learning',
              desc: 'Projects, quizzes, and real-world simulations to deepen understanding.'
            },
            {
              title: 'Expert Instructors',
              desc: 'Learn from top industry experts and academic professionals.'
            },
            {
              title: 'Global Community',
              desc: 'Join a worldwide network of motivated learners and mentors.'
            },
            {
              title: 'Certifications',
              desc: 'Receive digital certificates to showcase your achievements.'
            },
            {
              title: 'Career Roadmaps',
              desc: 'Step-by-step guides to help you land your dream job.'
            },
            {
              title: 'Lifelong Access',
              desc: 'Keep your access to all enrolled materials forever.'
            },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/90 dark:bg-[#1B263B] shadow-lg hover:shadow-2xl border border-[#F0F4F8] hover:border-[#00CFC1] transition-all">
              <h3 className="text-xl font-semibold text-[#00CFC1] dark:text-[#FFC857] mb-2">{f.title}</h3>
              <p className="text-sm text-[#007B8A] dark:text-[#A9D6E5]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;