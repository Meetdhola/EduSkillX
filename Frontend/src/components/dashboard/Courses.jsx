import React, { useState, useEffect } from 'react';
import { FaPlus, FaBook, FaUsers, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Courses = () => {
    const { isDarkMode } = useTheme();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        duration: '',
        price: '',
        category: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role);
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            let endpoint;
            
            switch (userRole) {
                case 'admin':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/admin/courses`;
                    break;
                case 'tutor':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/tutor/courses`;
                    break;
                default:
                    endpoint = `${import.meta.env.VITE_BASE_URI}/student/courses`;
            }
            
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const endpoint = userRole === 'admin' 
                ? `${import.meta.env.VITE_BASE_URI}/admin/courses`
                : `${import.meta.env.VITE_BASE_URI}/tutor/courses`;
            
            await axios.post(endpoint, newCourse, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCreateForm(false);
            setNewCourse({
                title: '',
                description: '',
                duration: '',
                price: '',
                category: ''
            });
            fetchCourses();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const handleEnrollCourse = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URI}/student/courses/${courseId}/enroll`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                // Update local state instead of refreshing the page
                setCourses(prevCourses => 
                    prevCourses.map(course => 
                        course._id === courseId 
                            ? { 
                                ...course, 
                                isEnrolled: true,
                                enrolledStudents: [...(course.enrolledStudents || []), user?._id || user?.id]
                            } 
                            : course
                    )
                );
                
                // Update user's enrolled courses in localStorage
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    userData.enrolledCourses = [...(userData.enrolledCourses || []), courseId];
                    localStorage.setItem('user', JSON.stringify(userData));
                }
                
                toast.success('Successfully enrolled in the course!');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            toast.error(error.response?.data?.message || 'Failed to enroll in course');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                {(userRole === 'admin' || userRole === 'tutor') && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                            isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        <FaPlus className="mr-2" />
                        Create Course
                    </button>
                )}
            </div>

            {/* Create Course Form */}
            {showCreateForm && (
                <div className={`mb-6 p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block mb-2">Title</label>
                            <input
                                type="text"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description</label>
                            <textarea
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                                rows="4"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">Duration (hours)</label>
                                <input
                                    type="number"
                                    value={newCourse.duration}
                                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300'
                                    }`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={newCourse.price}
                                    onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300'
                                    }`}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2">Category</label>
                            <input
                                type="text"
                                value={newCourse.category}
                                onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300'
                                }`}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className={`px-4 py-2 rounded-lg ${
                                    isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg ${
                                    isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } text-white`}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        className={`p-6 rounded-lg shadow-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-center mb-4">
                            <FaBook className={`text-2xl mr-3 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-500'
                            }`} />
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                        </div>
                        <p className={`mb-4 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            {course.description}
                        </p>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center">
                                <FaClock className={`mr-2 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span>{course.duration} hours</span>
                            </div>
                            <div className="flex items-center">
                                <FaUsers className={`mr-2 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span>{course.enrolledStudents?.length || 0} students</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">${course.price}</span>
                            <div className="flex space-x-2">
                                {userRole === 'student' && !course.isEnrolled && (
                                    <button
                                        onClick={() => handleEnrollCourse(course._id)}
                                        className={`px-4 py-2 rounded-lg ${
                                            isDarkMode
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-green-500 hover:bg-green-600'
                                        } text-white`}
                                    >
                                        Enroll
                                    </button>
                                )}
                                {(userRole === 'admin' || userRole === 'tutor') && (
                                    <>
                                        <button className={`p-2 rounded-lg ${
                                            isDarkMode
                                                ? 'text-blue-400 hover:bg-gray-700'
                                                : 'text-blue-600 hover:bg-gray-100'
                                        }`}>
                                            <FaEdit />
                                        </button>
                                        <button className={`p-2 rounded-lg ${
                                            isDarkMode
                                                ? 'text-red-400 hover:bg-gray-700'
                                                : 'text-red-600 hover:bg-gray-100'
                                        }`}>
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;