import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase, FaUserTie, FaMapMarkerAlt, FaClock, FaDollarSign, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Freelancing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Filter projects when search term or category changes
    filterProjects();
  }, [searchTerm, selectedCategory, projects]);

  const fetchUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userData || !token) {
        toast.error('Please login to view freelancing opportunities');
        navigate('/login');
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
      
      // Fetch freelancing projects
      await fetchProjects();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
      setLoading(false);
      toast.error('Failed to load user data');
    }
  };

  const fetchProjects = async () => {
    try {
      // For now, using mock data
      const mockProjects = [
        {
          _id: '1',
          title: 'React E-commerce Website Development',
          client: 'Fashion Retailer',
          location: 'Remote',
          duration: '2 months',
          description: 'Looking for a skilled React developer to build an e-commerce website with product catalog, shopping cart, and payment integration.',
          requirements: ['React', 'Redux', 'Node.js', 'MongoDB', 'Payment Gateway Integration'],
          category: 'frontend',
          budget: '$2,000 - $3,000',
          postedDate: '2023-06-15T10:00:00Z',
          deadline: '2023-07-15T23:59:59Z',
          relatedCourses: ['frontend', 'web-development', 'e-commerce']
        },
        {
          _id: '2',
          title: 'RESTful API Development for Mobile App',
          client: 'Health & Fitness Startup',
          location: 'Remote',
          duration: '1 month',
          description: 'Need a backend developer to create a RESTful API for a health and fitness tracking mobile application.',
          requirements: ['Node.js', 'Express', 'MongoDB', 'JWT Authentication', 'API Documentation'],
          category: 'backend',
          budget: '$1,500 - $2,000',
          postedDate: '2023-06-10T09:30:00Z',
          deadline: '2023-07-10T23:59:59Z',
          relatedCourses: ['backend', 'api-development']
        },
        {
          _id: '3',
          title: 'Full Stack Web Application for Real Estate',
          client: 'Real Estate Agency',
          location: 'Remote',
          duration: '3 months',
          description: 'Seeking a full stack developer to build a real estate listing and management platform with user authentication, property search, and admin dashboard.',
          requirements: ['React', 'Node.js', 'Express', 'MongoDB', 'Google Maps API'],
          category: 'fullstack',
          budget: '$3,000 - $4,000',
          postedDate: '2023-06-05T14:15:00Z',
          deadline: '2023-07-05T23:59:59Z',
          relatedCourses: ['fullstack', 'web-development']
        },
        {
          _id: '4',
          title: 'UI/UX Design for Mobile Banking App',
          client: 'FinTech Startup',
          location: 'Remote',
          duration: '2 months',
          description: 'Looking for a UI/UX designer to create wireframes, mockups, and prototypes for a mobile banking application.',
          requirements: ['Figma', 'Adobe XD', 'UI/UX principles', 'Mobile App Design', 'User Research'],
          category: 'design',
          budget: '$2,500 - $3,500',
          postedDate: '2023-06-20T11:45:00Z',
          deadline: '2023-07-20T23:59:59Z',
          relatedCourses: ['ui-ux', 'design', 'mobile-app']
        },
        {
          _id: '5',
          title: 'Data Analysis and Visualization Dashboard',
          client: 'E-commerce Company',
          location: 'Remote',
          duration: '1.5 months',
          description: 'Need a data scientist to analyze sales data and create an interactive dashboard for business insights.',
          requirements: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Tableau', 'SQL'],
          category: 'data-science',
          budget: '$2,000 - $2,500',
          postedDate: '2023-06-12T16:30:00Z',
          deadline: '2023-07-12T23:59:59Z',
          relatedCourses: ['data-science', 'python', 'data-visualization']
        }
      ];

      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);

      // Commented out API call for now
      /*
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/freelancing/projects`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(response.data);
      setFilteredProjects(response.data);
      setLoading(false);
      */
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
      setLoading(false);
      toast.error('Failed to load projects');
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.category === selectedCategory || 
        project.relatedCourses.includes(selectedCategory)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term) ||
        project.client.toLowerCase().includes(term) ||
        project.requirements.some(req => req.toLowerCase().includes(term))
      );
    }
    
    setFilteredProjects(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleApply = (projectId) => {
    // For now, just show a toast message
    toast.info('Application feature coming soon!');
    
    // In the future, this would navigate to an application form
    // navigate(`/freelancing/${projectId}/apply`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <h1 className="text-2xl font-bold text-gray-800">Freelancing Opportunities</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Completed Courses</h2>
          {completedCourses.length === 0 ? (
            <p className="text-gray-600">You haven't completed any courses yet. Complete courses to see relevant freelancing opportunities.</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
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
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Projects Found</h2>
              <p className="text-gray-600">No projects match your selected criteria. Try changing the filter or search term.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div 
                  key={project._id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FaUserTie className="mr-1" />
                        <span>{project.client}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaDollarSign className="mr-1" />
                          <span>{project.budget}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{project.description}</p>
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-800">Requirements:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.requirements.map((req, index) => (
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
                        <p>Posted: {formatDate(project.postedDate)}</p>
                        <p>Deadline: {formatDate(project.deadline)}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleApply(project._id)}
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

export default Freelancing; 