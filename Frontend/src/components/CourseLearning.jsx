import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaCheck, FaLock, FaUnlock, FaBook, FaGraduationCap, FaClock, FaStar, FaCreditCard, FaFileAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import YouTube from 'react-youtube';
import { getCurrentUser, getUserId } from '../utils/roleUtils';
import Opportunities from './Opportunities';

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    youtubeId: '',
    duration: 0
  });
  const userId = getUserId();
  const [showOpportunities, setShowOpportunities] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data && response.data.course) {
        const courseData = response.data.course;
        setCourse(courseData);
        
        // Check if user has paid for the course
        const hasPaid = courseData.paidStudents.includes(userId);
        setIsPaid(hasPaid);
        
        // Check if user has completed any modules
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.completedModules) {
          setCompletedModules(user.completedModules[courseId] || []);
          
          // Calculate progress
          if (courseData.modules && courseData.modules.length > 0) {
            const totalModules = courseData.modules.length;
            const completedCount = user.completedModules[courseId]?.length || 0;
            setProgress(Math.round((completedCount / totalModules) * 100));
          }
        }
      } else {
        setError("Course data not found");
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError(error.response?.data?.message || 'Failed to load course details');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (index) => {
    setCurrentModule(index);
    setCurrentVideo(0);
  };

  const handleVideoClick = (index) => {
    setCurrentVideo(index);
  };

  const handleVideoEnd = async () => {
    // Mark the current video as completed
    const updatedCompletedModules = [...completedModules];
    
    if (!updatedCompletedModules.includes(currentModule)) {
      updatedCompletedModules.push(currentModule);
      setCompletedModules(updatedCompletedModules);
      
      // Update progress
      if (course && course.modules) {
        const totalModules = course.modules.length;
        const completedCount = updatedCompletedModules.length;
        setProgress(Math.round((completedCount / totalModules) * 100));
      }
      
      // Update user's completed modules in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.completedModules = user.completedModules || {};
        user.completedModules[courseId] = updatedCompletedModules;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // If this was the last video in the module, mark the module as completed
      if (currentVideo === course.modules[currentModule].videos.length - 1) {
        toast.success('Module completed!');
        handleModuleComplete(currentModule);
      }
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${courseId}`, {
      state: course
    });
  };

  const handleTranscription = async (videoData = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to use this feature');
        return;
      }

      let video, youtubeUrl;
      if (videoData) {
        // For additional videos
        video = videoData;
        youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
      } else {
        // For main course videos
        video = course.modules[currentModule].videos[currentVideo];
        youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
      }
      
      setTranscriptionLoading(true);
      toast.info('Starting transcription process...');
      
      console.log('Making request to:', `${import.meta.env.VITE_BASE_URI}/api/transcriptions`);
      console.log('Request payload:', {
        youtubeUrl,
        videoTitle: video.title,
        videoId: video.youtubeId
      });
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/transcriptions`,
        { 
          youtubeUrl,
          videoTitle: video.title,
          videoId: video.youtubeId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response);
      
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        
        // Poll for transcription status
        if (response.data.data && response.data.data._id) {
          const transcriptionId = response.data.data._id;
          const checkStatus = async () => {
            try {
              const statusResponse = await axios.get(
                `${import.meta.env.VITE_BASE_URI}/api/transcriptions/${transcriptionId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              if (statusResponse.data.data.pdfPath) {
                window.open(`${import.meta.env.VITE_BASE_URI}/${statusResponse.data.data.pdfPath}`, '_blank');
                return true;
              }
              return false;
            } catch (error) {
              console.error('Error checking transcription status:', error);
              return true; // Stop polling on error
            }
          };
          
          // Poll every 5 seconds for up to 2 minutes
          let attempts = 0;
          const maxAttempts = 24; // 2 minutes
          const pollInterval = setInterval(async () => {
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              toast.info('You will be notified when the transcription is ready');
              return;
            }
            
            const isComplete = await checkStatus();
            if (isComplete) {
              clearInterval(pollInterval);
            }
            attempts++;
          }, 5000);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating transcription:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        config: error.config
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create transcription. Please try again.';
      toast.error(errorMessage);
    } finally {
      setTranscriptionLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/courses/${courseId}/modules/${currentModule}/videos`,
        newVideo,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Video added successfully');
      setShowAddVideoForm(false);
      setNewVideo({
        title: '',
        description: '',
        youtubeId: '',
        duration: 0
      });
      
      // Refresh course details
      fetchCourseDetails();
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error.response?.data?.message || 'Failed to add video');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Add this function to check if user can add videos
  const canAddVideos = () => {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'instructor');
  };

  // Add this function to check if user can manage course content
  const canManageContent = () => {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'instructor');
  };

  // Add this function to check if user is a regular user
  const isRegularUser = () => {
    const user = getCurrentUser();
    return user && user.role === 'user';
  };

  // Add this function to get the YouTube video ID from a URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleModuleComplete = async (moduleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to mark modules as complete');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/courses/${course._id}/modules/${moduleId}/complete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Module marked as complete!');
        
        // Check if all modules are completed
        const allModulesCompleted = course.modules.every(module => 
          module.completedBy.includes(userId)
        );
        
        if (allModulesCompleted) {
          toast.success('Congratulations! You have completed the entire course!');
          setShowOpportunities(true);
        }
        
        // Refresh course data
        fetchCourseDetails();
      }
    } catch (error) {
      console.error('Error marking module as complete:', error);
      toast.error('Failed to mark module as complete. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">{error || "The course you're trying to access doesn't exist."}</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // If user hasn't paid for the course, show payment required message
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            <FaArrowLeft className="mr-2" /> Back to Course
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaLock className="text-5xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Required</h2>
            <p className="text-gray-600 mb-6">
              You need to complete the payment to access this course content.
            </p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <FaCreditCard className="mr-2" />
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // YouTube player options
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="flex items-center text-blue-600 mr-4 hover:text-blue-800"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <FaArrowLeft className="mr-2" /> Back to Course
              </button>
              <h1 className="text-xl font-bold text-gray-800">{course.title}</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{progress}% Complete</div>
              </div>
              {canAddVideos() && (
                <button
                  onClick={() => setShowAddVideoForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-2"
                >
                  <FaPlus className="mr-2" />
                  Add Video
                </button>
              )}
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Modules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Course Content</h2>
              
              <div className="space-y-2">
                {course.modules && course.modules.map((module, index) => (
                  <div key={index} className="border-b border-gray-200 pb-2">
                    <button
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between ${
                        currentModule === index ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleModuleClick(index)}
                    >
                      <div className="flex items-center">
                        {completedModules.includes(index) ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaBook className="text-gray-400 mr-2" />
                        )}
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDuration(module.duration)}</span>
                    </button>
                    
                    {/* Videos in this module */}
                    {currentModule === index && module.videos && (
                      <div className="ml-6 mt-2 space-y-1">
                        {module.videos.map((video, videoIndex) => (
                          <button
                            key={videoIndex}
                            className={`w-full text-left p-2 rounded-lg flex items-center ${
                              currentVideo === videoIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleVideoClick(videoIndex)}
                          >
                            <FaPlay className="text-gray-400 mr-2" />
                            <span className="text-sm">{video.title}</span>
                          </button>
                        ))}
                        
                        {/* Add Video Button - Only for admin/instructor */}
                        {canAddVideos() && (
                          <button
                            className="w-full text-left p-2 rounded-lg flex items-center text-blue-600 hover:bg-blue-50"
                            onClick={() => setShowAddVideoForm(true)}
                          >
                            <FaPlus className="mr-2" />
                            <span className="text-sm">Add Video</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content - Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {course.modules && course.modules[currentModule] && 
               course.modules[currentModule].videos && 
               course.modules[currentModule].videos.length > 0 ? (
                <>
                  {/* Video Player - Different for regular users */}
                  {isRegularUser() ? (
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <iframe
                        width="100%"
                        height="390"
                        src={`https://www.youtube.com/embed/${course.modules[currentModule].videos[currentVideo].youtubeId}`}
                        title={course.modules[currentModule].videos[currentVideo].title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <YouTube 
                        videoId={course.modules[currentModule].videos[currentVideo].youtubeId} 
                        opts={opts} 
                        onEnd={handleVideoEnd}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleTranscription()}
                      disabled={transcriptionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaFileAlt className="mr-2" />
                      {transcriptionLoading ? 'Processing...' : 'Get Video Summary'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No video content available</h2>
                  <p className="text-gray-600 mb-4">This module doesn't have any video content yet.</p>
                  {canAddVideos() && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                      onClick={() => setShowAddVideoForm(true)}
                    >
                      <FaPlus className="mr-2" />
                      Add Video
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Additional Video for Regular Users */}
            {isRegularUser() && (
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    width="100%"
                    height="390"
                    src="https://www.youtube.com/embed/ZxKM3DCV2kE"
                    title="Introduction to the Course"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleTranscription({
                      youtubeId: 'ZxKM3DCV2kE',
                      title: 'Introduction to the Course'
                    })}
                    disabled={transcriptionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaFileAlt className="mr-2" />
                    {transcriptionLoading ? 'Processing...' : 'Get Video Summary'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Course Resources */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Course Resources</h2>
              
              {course.resources && course.resources.length > 0 ? (
                <div className="space-y-2">
                  {course.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="mr-3">
                        {resource.type === 'pdf' ? (
                          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{resource.title}</h3>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No resources available for this course.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Video Modal */}
      {showAddVideoForm && canAddVideos() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Video</h2>
            <form onSubmit={handleAddVideo}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  value={newVideo.youtubeId}
                  onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: parseInt(e.target.value) })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddVideoForm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show opportunities if the course is completed */}
      {showOpportunities && (
        <div className="mt-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Congratulations on completing the course! Here are some opportunities that match your skills.
                </p>
              </div>
            </div>
          </div>
          
          <Opportunities courseId={course._id} />
        </div>
      )}
    </div>
  );
};

export default CourseLearning;