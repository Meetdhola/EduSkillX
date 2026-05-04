import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaBell, FaPalette } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const tabItems = [
  { key: 'profile', label: 'Profile', icon: <FaUser /> },
  { key: 'security', label: 'Security', icon: <FaLock /> },
  { key: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { key: 'appearance', label: 'Appearance', icon: <FaPalette /> },
];

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    assignmentReminders: true
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setFormData({
        firstname: response.data.user.Fullname.firstname,
        lastname: response.data.user.Fullname.lastname,
        email: response.data.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/user/profile`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/user/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = async (key) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BASE_URI}/user/notifications`,
        {
          [key]: !notifications[key]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  return (
    <div className={`min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
          <h1 className="text-3xl font-extrabold mb-8 drop-shadow-lg">Settings</h1>
          {/* Tabs Navigation */}
          <div className="flex gap-3 mb-8">
            {tabItems.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all
                  ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                    : isDarkMode
                      ? 'bg-[#1B263B] text-[#A9D6E5] hover:bg-[#22304A]'
                      : 'bg-[#F9FAFB] text-[#0D3B66] hover:bg-[#F0F4F8]'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className={`rounded-xl p-6 shadow ${isDarkMode ? 'bg-[#1B263B]' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white font-semibold shadow hover:scale-105 transition"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className={`rounded-xl p-6 shadow ${isDarkMode ? 'bg-[#1B263B]' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block mb-2">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white font-semibold shadow hover:scale-105 transition"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className={`rounded-xl p-6 shadow ${isDarkMode ? 'bg-[#1B263B]' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  {
                    key: 'email',
                    title: 'Email Notifications',
                    desc: 'Receive notifications via email'
                  },
                  {
                    key: 'push',
                    title: 'Push Notifications',
                    desc: 'Receive push notifications in browser'
                  },
                  {
                    key: 'courseUpdates',
                    title: 'Course Updates',
                    desc: 'Get notified about course updates'
                  },
                  {
                    key: 'assignmentReminders',
                    title: 'Assignment Reminders',
                    desc: 'Get reminded about upcoming assignments'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications[item.key]
                          ? isDarkMode
                            ? 'bg-[#00CFC1]'
                            : 'bg-[#00CFC1]'
                          : isDarkMode
                            ? 'bg-[#22304A]'
                            : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className={`rounded-xl p-6 shadow ${isDarkMode ? 'bg-[#1B263B]' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    isDarkMode ? 'bg-[#00CFC1]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;