import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaSun, FaMoon } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import ErrorPopup from '../ErrorPopup';
import axios from 'axios';

const UserLogin = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simple email format check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/auth/login`, formData);
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Unable to connect to the server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-2 sm:px-4 bg-[#F9FAFB] font-[Inter]">
      {/* Error Popup */}
      {error && <ErrorPopup error={error} onClose={() => setError('')} />}

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 z-50 ${
          isDarkMode
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 shadow-lg'
            : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg'
        }`}
      >
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/90 rounded-2xl shadow-lg p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-br from-[#00CFC1] via-[#007B8A] to-[#FFC857]">
                <RiGraduationCapFill className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0D3B66] mb-2 drop-shadow-lg">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to continue your learning journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-[#0D3B66]">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#00CFC1] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00CFC1] hover:text-[#007B8A] transition"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white mt-6 py-3.5 px-6 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-white hover:shadow-md transition">
              <FaGoogle className="text-red-500" size={18} />
              <span className="text-sm font-medium text-[#0D3B66]">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-white hover:shadow-md transition">
              <FaFacebook className="text-blue-600" size={18} />
              <span className="text-sm font-medium text-[#0D3B66]">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#00CFC1] hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;