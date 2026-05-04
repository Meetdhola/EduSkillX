import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort, FaBook, FaGraduationCap, FaClock, FaStar, FaUserGraduate, FaEdit, FaTrash, FaChartBar, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BsVr } from 'react-icons/bs';
import CreateCourse from './CreateCourse';
import { isInstructor, isAdmin } from '../utils/roleUtils';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    type: '',
    price: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [arvrCourses, setArvrCourses] = useState([]);
  const [activeView, setActiveView] = useState('all'); // 'all', 'enrolled', 'instructor', 'featured', 'categories', 'arvr'

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchCourses();
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`${API_URL}/api/courses/categories`, { headers });
      
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch featured courses
  const fetchFeaturedCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view featured courses');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`${API_URL}/api/courses/featured`, { headers });
      
      if (response.data && response.data.courses) {
        setFeaturedCourses(response.data.courses);
        setCourses(response.data.courses);
      } else {
        setError('Failed to load featured courses');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      setError(error.response?.data?.message || 'Failed to load featured courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view enrolled courses');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`${API_URL}/api/courses/user/courses`, { headers });
      
      if (response.data && response.data.courses) {
        setEnrolledCourses(response.data.courses);
        setCourses(response.data.courses);
      } else {
        setError('Failed to load enrolled courses');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError(error.response?.data?.message || 'Failed to load enrolled courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructor courses
  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view instructor courses');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`${API_URL}/api/courses/instructor/courses`, { headers });
      
      if (response.data && response.data.courses) {
        setInstructorCourses(response.data.courses);
        setCourses(response.data.courses);
      } else {
        setError('Failed to load instructor courses');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      setError(error.response?.data?.message || 'Failed to load instructor courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AR/VR courses
  const fetchArvrCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view AR/VR courses');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Set type filter to 'arvr'
      setFilters(prev => ({ ...prev, type: 'arvr' }));
      
      const response = await axios.get(`${API_URL}/api/courses?type=arvr`, { headers });
      
      if (response.data && response.data.courses) {
        setArvrCourses(response.data.courses);
        setCourses(response.data.courses);
      } else {
        setError('Failed to load AR/VR courses');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching AR/VR courses:', error);
      setError(error.response?.data?.message || 'Failed to load AR/VR courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Automatically fetch data based on the selected view
    switch (view) {
      case 'all':
        // Automatically fetch all courses when switching to all courses view
        fetchCourses();
        break;
      case 'enrolled':
        fetchEnrolledCourses();
        break;
      case 'instructor':
        fetchInstructorCourses();
        break;
      case 'featured':
        fetchFeaturedCourses();
        break;
      case 'categories':
        fetchCourses();
        break;
      case 'arvr':
        fetchArvrCourses();
        break;
      default:
        fetchCourses();
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category }));
    fetchCourses(true);
  };

  const fetchCourses = async (useFilters = true) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view courses');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Determine which endpoint to use based on user role
      let endpoint = '/api/courses';
      if (user?.role === 'instructor') {
        endpoint = '/api/courses/instructor/courses';
      } else if (user?.role === 'user') {
        endpoint = '/api/courses/user/courses';
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (useFilters) {
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
        if (filters.instructor) queryParams.append('instructor', filters.instructor);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (searchTerm) queryParams.append('search', searchTerm);
      }
      
      if (sortBy) queryParams.append('sortBy', sortBy);
      
      console.log(`Fetching courses from: ${API_URL}${endpoint}?${queryParams.toString()}`);
      
      const response = await axios.get(`${API_URL}${endpoint}?${queryParams.toString()}`, { headers });
      
      if (response.data && response.data.courses) {
        // Log the first few courses to check enrollment status
        console.log('Courses data:', response.data.courses.slice(0, 3).map(course => ({
          id: course._id,
          title: course.title,
          isEnrolled: course.isEnrolled,
          enrolledStudents: course.enrolledStudents
        })));
        
        setCourses(response.data.courses);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Failed to load courses: Invalid response format');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 403) {
        // If access is denied, try to fetch public courses
        if (user?.role === 'instructor') {
          setError('You do not have permission to access these courses.');
        } else {
          // For regular users, try to fetch public courses
          try {
            const publicResponse = await axios.get(`${API_URL}/api/courses?status=published`);
            if (publicResponse.data && publicResponse.data.courses) {
              setCourses(publicResponse.data.courses);
            } else {
              setCourses([]);
            }
          } catch (publicError) {
            setError('Failed to load public courses');
            setCourses([]);
          }
        }
      } else {
        setError(error.response?.data?.message || 'Failed to load courses');
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleApplyFilters = () => {
    fetchCourses(true);
  };

  const handleShowAllCourses = () => {
    setFilters({
      type: '',
      difficulty: '',
      instructor: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
    fetchCourses(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Handle course enrollment
  const handleEnroll = async (courseId, e) => {
    if (e) e.stopPropagation(); // Prevent navigation to course details
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to enroll in courses');
            return;
        }

        // Validate course ID
        if (!courseId || typeof courseId !== 'string' || courseId.length !== 24) {
            console.error('Invalid course ID:', courseId);
            toast.error('Invalid course ID. Please try again.');
            return;
        }

        console.log('Enrolling in course:', courseId);
        console.log('Token format:', token);

        const headers = { Authorization: `Bearer ${token}` };
        console.log('Headers:', headers);

        // Show loading toast
        const loadingToastId = toast.loading('Enrolling in course...');

        try {
            const response = await axios.post(`${API_URL}/api/courses/${courseId}/enroll`, {}, { headers });
            
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            if (response.data) {
                toast.success('Successfully enrolled in the course!');
                
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
            }
        } catch (error) {
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            console.error('Error enrolling in course:', error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                
                if (error.response.status === 400) {
                    toast.error(error.response.data.errors?.[0]?.msg || 'Already enrolled in this course');
                } else if (error.response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (error.response.status === 404) {
                    toast.error('Course not found. It may have been removed.');
                } else if (error.response.status === 500) {
                    toast.error('Server error. Please try again later.');
                    console.error('Server error details:', error.response.data);
                } else {
                    toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                toast.error('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                toast.error('Failed to set up the request. Please try again.');
            }
        }
    } catch (error) {
        console.error('Unexpected error in handleEnroll:', error);
        toast.error('An unexpected error occurred. Please try again.');
    }
  };

  // Handle course unenrollment
  const handleUnenroll = async (courseId, e) => {
    if (e) e.stopPropagation(); // Prevent navigation to course details
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to unenroll from courses');
            return;
        }

        // Validate course ID
        if (!courseId || typeof courseId !== 'string' || courseId.length !== 24) {
            console.error('Invalid course ID:', courseId);
            toast.error('Invalid course ID. Please try again.');
            return;
        }

        console.log('Unenrolling from course:', courseId);
        console.log('Token format:', token);

        const headers = { Authorization: `Bearer ${token}` };
        console.log('Headers:', headers);

        // Show loading toast
        const loadingToastId = toast.loading('Unenrolling from course...');

        try {
            const response = await axios.post(`${API_URL}/api/courses/${courseId}/unenroll`, {}, { headers });
            
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            if (response.data) {
                toast.success('Successfully unenrolled from the course!');
                
                // Update local state instead of refreshing the page
                setCourses(prevCourses => 
                    prevCourses.map(course => 
                        course._id === courseId 
                            ? { 
                                ...course, 
                                isEnrolled: false,
                                enrolledStudents: (course.enrolledStudents || []).filter(id => id !== (user?._id || user?.id))
                            } 
                            : course
                    )
                );
                
                // Update user's enrolled courses in localStorage
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    userData.enrolledCourses = (userData.enrolledCourses || []).filter(id => id !== courseId);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
        } catch (error) {
            // Dismiss loading toast
            toast.dismiss(loadingToastId);
            
            console.error('Error unenrolling from course:', error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                
                if (error.response.status === 400) {
                    toast.error(error.response.data.errors?.[0]?.msg || 'Not enrolled in this course');
                } else if (error.response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (error.response.status === 404) {
                    toast.error('Course not found. It may have been removed.');
                } else if (error.response.status === 500) {
                    toast.error('Server error. Please try again later.');
                    console.error('Server error details:', error.response.data);
                } else {
                    toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                toast.error('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                toast.error('Failed to set up the request. Please try again.');
            }
        }
    } catch (error) {
        console.error('Unexpected error in handleUnenroll:', error);
        toast.error('An unexpected error occurred. Please try again.');
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation(); // Prevent navigation to course details
    
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete courses');
        navigate('/login');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.delete(
        `${API_URL}/api/courses/${courseId}`,
        { headers }
      );
      
      if (response.data) {
        toast.success('Course deleted successfully');
        // Refresh courses to update the list
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this course');
      } else if (error.response?.status === 404) {
        toast.error('Course not found');
      } else {
        toast.error('Failed to delete the course. Please try again.');
      }
    }
  };

  // Handle course rating
  const handleRateCourse = async (courseId, rating, e) => {
    e.stopPropagation(); // Prevent navigation to course details
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to rate courses');
        navigate('/login');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(
        `${API_URL}/api/courses/${courseId}/rating`,
        { rating },
        { headers }
      );
      
      if (response.data) {
        toast.success('Rating updated successfully');
        // Refresh courses to update rating
        fetchCourses();
      }
    } catch (error) {
      console.error('Error rating course:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to rate this course');
      } else if (error.response?.status === 404) {
        toast.error('Course not found');
      } else {
        toast.error('Failed to update rating. Please try again.');
      }
    }
  };

  // Fetch course analytics
  const fetchCourseAnalytics = async (courseId) => {
    try {
      setAnalyticsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view analytics');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(
        `${API_URL}/api/courses/${courseId}/analytics`,
        { headers }
      );
      
      if (response.data && response.data.analytics) {
        setAnalytics(response.data.analytics);
        setShowAnalytics(true);
      }
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view analytics for this course');
      } else if (error.response?.status === 404) {
        toast.error('Course not found');
      } else {
        toast.error('Failed to fetch analytics. Please try again.');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Handle view analytics
  const handleViewAnalytics = (course, e) => {
    e.stopPropagation(); // Prevent navigation to course details
    setSelectedCourse(course);
    fetchCourseAnalytics(course._id);
  };

  // Close analytics modal
  const handleCloseAnalytics = () => {
    setShowAnalytics(false);
    setAnalytics(null);
    setSelectedCourse(null);
  };

  // Handle course creation navigation
  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] px-0 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-[#0D3B66] tracking-tight drop-shadow-lg">
            {activeView === 'tutor' ? 'My Courses' : 
             activeView === 'enrolled' ? 'Enrolled Courses' : 
             activeView === 'featured' ? 'Featured Courses' :
             activeView === 'arvr' ? 'AR/VR Courses' :
             activeView === 'categories' ? 'Browse by Category' :
             'All Courses'
             }
          </h1>
          <div className="flex gap-4">
            {(user?.role === 'tutor' || user?.role === 'admin') && (
              <button 
                className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                onClick={handleCreateCourse}
              >
                <FaPlus className="inline mr-2" /> Create Course
              </button>
            )}
            <button 
              className="bg-[#0D3B66] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#007B8A] hover:scale-105 hover:shadow-lg transition"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Course Route Navigation */}
        <div className="bg-white/80 rounded-xl shadow-md p-5 mb-8 flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'all' 
                ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
            }`}
            onClick={() => handleViewChange('all')}
          >
            All Courses
          </button>
          {user?.role === 'user' && (
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'enrolled' 
                  ? 'bg-gradient-to-r from-[#FFC857] to-[#00CFC1] text-white shadow'
                  : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#FFF9E5]'
              }`}
              onClick={() => handleViewChange('enrolled')}
            >
              My Enrolled Courses
            </button>
          )}
          {user?.role === 'instructor' && (
            <>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeView === 'instructor' 
                    ? 'bg-gradient-to-r from-[#FFC857] to-[#007B8A] text-white shadow'
                    : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#FFF9E5]'
                }`}
                onClick={() => handleViewChange('instructor')}
              >
                My Courses
              </button>
            </>
          )}
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'featured' 
                ? 'bg-gradient-to-r from-[#007B8A] to-[#00CFC1] text-white shadow'
                : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
            }`}
            onClick={() => handleViewChange('featured')}
          >
            Featured Courses
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'categories' 
                ? 'bg-gradient-to-r from-[#00CFC1] to-[#FFC857] text-white shadow'
                : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#FFF9E5]'
            }`}
            onClick={() => handleViewChange('categories')}
          >
            Browse by Category
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'arvr' 
                ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
            }`}
            onClick={() => handleViewChange('arvr')}
          >
            AR/VR Courses
          </button>
        </div>

        {/* Categories Section */}
        {activeView === 'categories' && categories.length > 0 && (
          <div className="bg-white/80 rounded-xl shadow-md p-5 mb-8">
            <h2 className="text-lg font-semibold text-[#0D3B66] mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filters.category === category
                      ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                      : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !filters.category
                    ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                    : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
                }`}
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: '' }));
                  fetchCourses(true);
                }}
              >
                All Categories
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white/80 rounded-xl shadow-md p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#F9FAFB] shadow focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              </div>
              <button 
                type="submit"
                className="ml-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
              >
                Search
              </button>
            </form>
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 bg-[#F0F4F8] text-[#0D3B66] px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#E5F9F7] transition"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>
              <div className="relative">
                <select
                  className="appearance-none bg-[#F0F4F8] text-[#0D3B66] px-5 py-2 pr-8 rounded-xl font-semibold shadow focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00CFC1] pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border-t border-[#F0F4F8]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0D3B66] mb-1">Course Type</label>
                  <select
                    name="type"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="arvr">AR/VR</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D3B66] mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D3B66] mb-1">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D3B66] mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white/80 rounded-xl shadow-md p-12 text-center">
            <FaBook className="mx-auto text-[#00CFC1] text-5xl mb-4" />
            <h3 className="text-2xl font-bold text-[#0D3B66] mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {user?.role === 'instructor' 
                ? "You haven't created any courses yet. Click 'Create Course' to get started." 
                : "No courses match your search criteria. Try adjusting your filters or browse all courses."}
            </p>
            {user?.role === 'instructor' ? (
              <button 
                className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                onClick={handleCreateCourse}
              >
                <FaPlus className="inline mr-2" /> Create Course
              </button>
            ) : (
              <button 
                className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                onClick={handleShowAllCourses}
              >
                Show All Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white/90 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#00CFC1] group cursor-pointer"
              >
                <div 
                  className="h-48 bg-[#F0F4F8] relative"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <BsVr className="text-[#00CFC1] text-4xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white text-xs px-3 py-1 rounded-full shadow">
                    {course.type === 'arvr' ? 'AR/VR' : 'Regular'}
                  </div>
                  {course.status && user?.role === 'instructor' && (
                    <div className={`absolute top-2 left-2 text-xs px-3 py-1 rounded-full shadow ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' :
                      course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 
                    className="font-semibold text-lg text-[#0D3B66] mb-1 hover:underline"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    {course.title}
                  </h3>
                  <p className="text-[#007B8A] text-xs mb-2">{course.category}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaClock className="mr-1" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span>{course.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-[#0D3B66] mb-1">Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.topics?.slice(0, 3).map((topic, index) => (
                        <span key={index} className="text-xs bg-[#F0F4F8] text-[#007B8A] px-2 py-1 rounded">
                          {topic.title}
                        </span>
                      ))}
                      {course.topics?.length > 3 && (
                        <span className="text-xs text-gray-400">+{course.topics.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[#00CFC1] font-bold">
                      ${course.price.toFixed(2)}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-semibold shadow ${
                      course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                    <div>
                      <span className="font-semibold">Status:</span>{' '}
                      <span className={`${
                        course.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Enrolled:</span>{' '}
                      <span>{course.enrolledStudentsCount || 0} students</span>
                    </div>
                    <div>
                      <span className="font-semibold">Completion Rate:</span>{' '}
                      <span>{course.completionRate || 0}%</span>
                    </div>
                    <div>
                      <span className="font-semibold">Last Updated:</span>{' '}
                      <span>{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  {course.requirements?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-[#0D3B66] mb-1">Requirements:</h4>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {course.requirements.slice(0, 2).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                        {course.requirements.length > 2 && (
                          <li className="text-gray-400">+{course.requirements.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Objectives */}
                  {course.objectives?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-[#0D3B66] mb-1">Objectives:</h4>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {course.objectives.slice(0, 2).map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                        {course.objectives.length > 2 && (
                          <li className="text-gray-400">+{course.objectives.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {user?.role === 'user' && course.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(course.progress)}%</span>
                      </div>
                      <div className="w-full bg-[#F0F4F8] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] h-2 rounded-full transition-all duration-700"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user?.role === 'instructor' && course.instructor === JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id && (
                      <>
                        <button
                          className="flex-1 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                          onClick={(e) => navigate(`/courses/edit/${course._id}`, { state: { course } })}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-[#FFC857] to-[#FF6B6B] text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                          onClick={(e) => handleDeleteCourse(course._id, e)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-[#A259FF] to-[#00CFC1] text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                          onClick={(e) => handleViewAnalytics(course, e)}
                        >
                          <FaChartBar className="mr-1" /> Analytics
                        </button>
                      </>
                    )}
                    
                    {user?.role === 'user' && (
                      <>
                        {course.isEnrolled ? (
                          <button
                            className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFC857] text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                            onClick={(e) => handleUnenroll(course._id, e)}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            className="w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                            onClick={(e) => handleEnroll(course._id, e)}
                          >
                            Enroll
                          </button>
                        )}
                      </>
                    )}
                    
                    {user?.role === 'user' && course.isEnrolled && (
                      <div className="w-full mt-2">
                        <label className="block text-xs font-semibold text-[#0D3B66] mb-1">Rate this course:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className={`text-xl ${star <= (course.userRating || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:scale-125 transition`}
                              onClick={(e) => handleRateCourse(course._id, star, e)}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#0D3B66]">
                  Course Analytics: {selectedCourse?.title}
                </h2>
                <button
                  className="text-gray-400 hover:text-[#0D3B66] transition"
                  onClick={handleCloseAnalytics}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {analyticsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
                </div>
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F0F4F8] p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#007B8A] mb-2">Total Students</h3>
                      <p className="text-3xl font-bold text-[#00CFC1]">{analytics.totalStudents}</p>
                    </div>
                    <div className="bg-[#F0F4F8] p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#007B8A] mb-2">Completion Rate</h3>
                      <p className="text-3xl font-bold text-[#00CFC1]">{analytics.completionRate}%</p>
                    </div>
                    <div className="bg-[#F0F4F8] p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#007B8A] mb-2">Average Rating</h3>
                      <p className="text-3xl font-bold text-[#FFC857]">{analytics.averageRating.toFixed(1)}</p>
                    </div>
                    <div className="bg-[#F0F4F8] p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#007B8A] mb-2">Revenue</h3>
                      <p className="text-3xl font-bold text-[#00CFC1]">${analytics.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-[#0D3B66] mb-4">Course Performance</h3>
                    <div className="bg-[#F9FAFB] p-4 rounded-lg">
                      <p className="text-gray-600">
                        This course has {analytics.totalStudents} enrolled students with a completion rate of {analytics.completionRate}%.
                        The average rating is {analytics.averageRating.toFixed(1)} out of 5 stars.
                        Total revenue generated is ${analytics.revenue.toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No analytics data available for this course.</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-[#F0F4F8] text-[#0D3B66] px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#E5F9F7] transition"
                  onClick={handleCloseAnalytics}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;