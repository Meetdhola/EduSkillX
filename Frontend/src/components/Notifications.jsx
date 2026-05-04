import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaCheck, FaTimes, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
// import mockNotifications from '../data/notifications.json';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('User data from localStorage:', userData);
    console.log('Token from localStorage:', token);
    
    if (userData && token) {
      try {
        // Verify that userData is valid JSON
        const user = JSON.parse(userData);
        console.log('Parsed user data:', user);
        
        // Check for either 'id' or '_id' property
        if (user && (user._id || user.id)) {
          setIsLoggedIn(true);
          fetchNotifications();
        } else {
          console.log('User data missing id property');
          setIsLoggedIn(false);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        setIsLoggedIn(false);
        setLoading(false);
      }
    } else {
      console.log('Missing user data or token');
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Get current user ID from localStorage
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      // Use either 'id' or '_id' property
      const currentUserId = user?._id || user?.id;

      console.log('Current user ID for notifications:', currentUserId);

      if (!currentUserId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      // For testing purposes, let's log the user ID and available notifications
      console.log('Available notifications:', mockNotifications.notifications);

      // Create a default notification for the current user
      const defaultNotification = {
        _id: 'default-notification',
        user: currentUserId,
        type: 'system',
        title: 'Welcome to EduSkillX',
        message: 'Thank you for joining our platform. You can now access your courses and track your progress.',
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Always show at least the default notification
      setNotifications([defaultNotification]);
      setLoading(false);
      
      // Commented out API call for now
      /*
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/dashboard/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(response.data);
      setLoading(false);
      */
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
      setLoading(false);
      toast.error('Failed to load notifications');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Update local state only for now
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      toast.success('Notification marked as read');
      
      // Commented out API call for now
      /*
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/dashboard/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      toast.success('Notification marked as read');
      */
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBell className="text-5xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to view your notifications.</p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaSignInAlt className="mr-2" /> Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaTimes className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBell className="text-5xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Notifications</h2>
            <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification._id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatTimestamp(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="ml-4 p-2 text-gray-400 hover:text-green-500 transition-colors"
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                </div>
                {notification.link && (
                  <a 
                    href={notification.link}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm inline-block"
                  >
                    View Details →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 