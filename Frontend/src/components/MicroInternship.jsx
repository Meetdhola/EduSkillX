import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaClock, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MicroInternship = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view internships');
        navigate('/login');
        return;
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('User data not found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user?._id || user?.id;

      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      // Fetch completed courses
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/courses/user/${userId}/completed`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setCompletedCourses(response.data);
      
      // Fetch internships
      await fetchInternships();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
      setLoading(false);
      toast.error('Failed to load user data');
    }
  };

  const fetchInternships = async () => {
    try {
      // For now, using mock data
      const mockInternships = [
        {
          _id: '1',
          title: 'Frontend Development Intern',
          company: 'Tech Solutions Inc.',
          location: 'Remote',
          duration: '3 months',
          description: 'Join our team as a Frontend Development Intern and work on exciting projects using React, JavaScript, and modern web technologies.',
          requirements: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
          category: 'frontend',
          salary: '$500/month',
          postedDate: '2023-06-15T10:00:00Z',
          applicationDeadline: '2023-07-15T23:59:59Z',
          relatedCourses: ['frontend', 'web-development']
        },
        {
          _id: '2',
          title: 'Backend Development Intern',
          company: 'Data Systems Ltd.',
          location: 'Hybrid',
          duration: '6 months',
          description: 'Work on server-side applications, APIs, and databases as a Backend Development Intern.',
          requirements: ['Node.js', 'Express', 'MongoDB', 'RESTful APIs'],
          category: 'backend',
          salary: '$600/month',
          postedDate: '2023-06-10T09:30:00Z',
          applicationDeadline: '2023-07-10T23:59:59Z',
          relatedCourses: ['backend', 'api-development']
        },
        {
          _id: '3',
          title: 'Full Stack Development Intern',
          company: 'Innovation Hub',
          location: 'On-site',
          duration: '4 months',
          description: 'Gain experience in both frontend and backend development as a Full Stack Development Intern.',
          requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
          category: 'fullstack',
          salary: '$700/month',
          postedDate: '2023-06-05T14:15:00Z',
          applicationDeadline: '2023-07-05T23:59:59Z',
          relatedCourses: ['fullstack', 'web-development']
        },
        {
          _id: '4',
          title: 'UI/UX Design Intern',
          company: 'Creative Designs Co.',
          location: 'Remote',
          duration: '3 months',
          description: 'Work on user interface and experience design projects as a UI/UX Design Intern.',
          requirements: ['Figma', 'Adobe XD', 'UI/UX principles', 'Prototyping'],
          category: 'design',
          salary: '$550/month',
          postedDate: '2023-06-20T11:45:00Z',
          applicationDeadline: '2023-07-20T23:59:59Z',
          relatedCourses: ['design', 'ui-ux']
        },
        {
          _id: '5',
          title: 'Data Science Intern',
          company: 'Analytics Pro',
          location: 'Hybrid',
          duration: '6 months',
          description: 'Work with data analysis, machine learning, and statistical modeling as a Data Science Intern.',
          requirements: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Data visualization'],
          category: 'data-science',
          salary: '$650/month',
          postedDate: '2023-06-12T13:20:00Z',
          applicationDeadline: '2023-07-12T23:59:59Z',
          relatedCourses: ['data-science', 'machine-learning']
        }
      ];

      setInternships(mockInternships);
      setFilteredInternships(mockInternships);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setError('Failed to load internships');
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredInternships(internships);
    } else {
      const filtered = internships.filter(internship => internship.category === category);
      setFilteredInternships(filtered);
    }
  };

  const handleApply = (internshipId) => {
    // For now, just show a toast message
    toast.success('Application submitted successfully!');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button 
            className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Micro Internships</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Completed Courses</h2>
          {completedCourses.length === 0 ? (
            <p className="text-gray-600">You haven't completed any courses yet. Complete courses to see relevant internships.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCourses.map(course => (
                <div key={course._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange('frontend')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'frontend'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Frontend
            </button>
            <button
              onClick={() => handleCategoryChange('backend')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'backend'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Backend
            </button>
            <button
              onClick={() => handleCategoryChange('fullstack')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'fullstack'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Full Stack
            </button>
            <button
              onClick={() => handleCategoryChange('design')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'design'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => handleCategoryChange('data-science')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'data-science'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Data Science
            </button>
          </div>

          {filteredInternships.length === 0 ? (
            <div className="text-center py-8">
              <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Internships Found</h2>
              <p className="text-gray-600">No internships match your selected criteria. Try changing the filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInternships.map((internship) => (
                <div 
                  key={internship._id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{internship.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FaBuilding className="mr-1" />
                        <span>{internship.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{internship.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{internship.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="mr-1" />
                          <span>{internship.salary}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{internship.description}</p>
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-800">Requirements:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {internship.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <p>Posted: {formatDate(internship.postedDate)}</p>
                        <p>Application Deadline: {formatDate(internship.applicationDeadline)}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleApply(internship._id)}
                        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroInternship; 