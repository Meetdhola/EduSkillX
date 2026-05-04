import React, { useState, useEffect } from 'react';
import { FaUsers, FaBook, FaGraduationCap, FaChartLine, FaClock, FaStar } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const Analytics = () => {
    const { isDarkMode } = useTheme();
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        activeStudents: 0,
        completionRate: 0,
        averageRating: 0
    });
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role);
        fetchAnalytics();
        // eslint-disable-next-line
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            let endpoint;
            switch (userRole) {
                case 'admin':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/admin/analytics`;
                    break;
                case 'tutor':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/tutor/analytics`;
                    break;
                default:
                    endpoint = `${import.meta.env.VITE_BASE_URI}/student/analytics`;
            }
            const response = await axios.get(endpoint, {
                params: { timeRange },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleSpecificStats = () => {
        switch (userRole) {
            case 'admin':
                return [
                    {
                        title: 'Total Users',
                        value: stats.totalUsers,
                        icon: <FaUsers className="text-blue-500" />,
                        change: '+12%'
                    },
                    {
                        title: 'Total Courses',
                        value: stats.totalCourses,
                        icon: <FaBook className="text-green-500" />,
                        change: '+5%'
                    },
                    {
                        title: 'Total Revenue',
                        value: `$${stats.totalRevenue.toLocaleString()}`,
                        icon: <FaChartLine className="text-purple-500" />,
                        change: '+8%'
                    },
                    {
                        title: 'Active Students',
                        value: stats.activeStudents,
                        icon: <FaGraduationCap className="text-yellow-500" />,
                        change: '+15%'
                    }
                ];
            case 'tutor':
                return [
                    {
                        title: 'Total Students',
                        value: stats.totalUsers,
                        icon: <FaUsers className="text-blue-500" />,
                        change: '+10%'
                    },
                    {
                        title: 'Active Courses',
                        value: stats.totalCourses,
                        icon: <FaBook className="text-green-500" />,
                        change: '+3%'
                    },
                    {
                        title: 'Completion Rate',
                        value: `${stats.completionRate}%`,
                        icon: <FaGraduationCap className="text-yellow-500" />,
                        change: '+5%'
                    },
                    {
                        title: 'Average Rating',
                        value: stats.averageRating?.toFixed(1) || 0,
                        icon: <FaStar className="text-purple-500" />,
                        change: '+0.2'
                    }
                ];
            default:
                return [
                    {
                        title: 'Enrolled Courses',
                        value: stats.totalCourses,
                        icon: <FaBook className="text-blue-500" />,
                        change: '+2'
                    },
                    {
                        title: 'Hours Completed',
                        value: stats.totalHours || 0,
                        icon: <FaClock className="text-green-500" />,
                        change: '+5'
                    },
                    {
                        title: 'Completion Rate',
                        value: `${stats.completionRate}%`,
                        icon: <FaGraduationCap className="text-yellow-500" />,
                        change: '+3%'
                    },
                    {
                        title: 'Average Score',
                        value: stats.averageScore || 0,
                        icon: <FaStar className="text-purple-500" />,
                        change: '+2'
                    }
                ];
        }
    };

    return (
        <div className={`min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
            <div className="max-w-7xl mx-auto py-10 px-4">
                <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-extrabold drop-shadow-lg">Analytics</h1>
                        <div className="flex space-x-2">
                            {['week', 'month', 'year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-5 py-2 rounded-xl font-semibold transition-all
                                        ${timeRange === range
                                            ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                                            : isDarkMode
                                                ? 'bg-[#1B263B] text-[#A9D6E5] hover:bg-[#22304A]'
                                                : 'bg-[#F9FAFB] text-[#0D3B66] hover:bg-[#F0F4F8]'
                                        }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {getRoleSpecificStats().map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`p-6 rounded-2xl shadow border
                                            ${isDarkMode ? 'bg-[#1B263B] border-[#22304A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#14213D]' : 'bg-white'}`}>
                                                {stat.icon}
                                            </div>
                                            <span className={`text-sm font-semibold ${
                                                stat.change?.toString().startsWith('+')
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</h3>
                                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Activity Chart */}
                                <div className={`p-6 rounded-2xl shadow border ${isDarkMode ? 'bg-[#1B263B] border-[#22304A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                                    <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
                                    <div className="h-64 flex items-center justify-center">
                                        <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                                            Activity chart will be implemented here
                                        </p>
                                    </div>
                                </div>
                                {/* Performance Chart */}
                                <div className={`p-6 rounded-2xl shadow border ${isDarkMode ? 'bg-[#1B263B] border-[#22304A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                                    <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                                    <div className="h-64 flex items-center justify-center">
                                        <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                                            Performance chart will be implemented here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;