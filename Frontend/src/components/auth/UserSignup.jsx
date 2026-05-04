import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSun, FaMoon, FaUserPlus, FaChevronDown } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { UserDataContext } from '../../context/userContext';
import ErrorPopup from '../ErrorPopup';
import axios from 'axios';

const UserSignup = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { setUserData } = useContext(UserDataContext);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        Fullname: {
            firstname: '',
            lastname: ''
        },
        email: '',
        password: '',
        role: '',
        agreeToTerms: false
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'firstname' || name === 'lastname') {
            setFormData(prev => ({
                ...prev,
                Fullname: {
                    ...prev.Fullname,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (
            !formData.Fullname.firstname.trim() ||
            !formData.Fullname.lastname.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.role
        ) {
            setError('Please fill in all required fields.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!formData.agreeToTerms) {
            setError('You must agree to the Terms & Conditions and Privacy Policy.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/auth/register`, formData);
            if (response.data) {
                setUserData(response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            let errorMessage = 'An error occurred during signup. Please try again.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }
            setError(errorMessage);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-10 px-2 sm:px-4 bg-[#F9FAFB] font-[Inter]`}>
            {/* Error Popup */}
            {error && <ErrorPopup error={error} onClose={() => setError('')} />}

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 z-50 ${isDarkMode
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
                                <FaUserPlus className="text-3xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#0D3B66] mb-2 drop-shadow-lg">Create Account</h1>
                        <p className="text-gray-500 text-sm">Join our learning community today</p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#0D3B66] mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.Fullname.firstname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                                    placeholder="Enter your first name"
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.Fullname.lastname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                                    placeholder="Enter your last name"
                                    required
                                    minLength={3}
                                />
                            </div>
                        </div>
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
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
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
                        <div>
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Select Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pr-10 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] appearance-none focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                                    required
                                >
                                    <option value="" disabled>
                                        Select your role
                                    </option>
                                    <option value="user">User</option>
                                    <option value="tutor">Tutor</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00CFC1] pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 mt-2">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 rounded border border-[#E5E7EB] text-[#00CFC1] focus:ring-[#00CFC1]"
                                required
                            />
                            <label className="text-gray-600 text-sm">
                                I agree to the{" "}
                                <Link to="/terms" className="font-medium text-[#00CFC1] hover:underline">Terms & Conditions</Link>
                                {" "}and{" "}
                                <Link to="/privacy" className="font-medium text-[#00CFC1] hover:underline">Privacy Policy</Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white mt-6 py-3.5 px-6 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm mt-6 text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#00CFC1] hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;