import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateCourse = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'regular',
    duration: 60,
    difficulty: 'beginner',
    price: 0,
    requirements: [''],
    objectives: [''],
    topics: [
      {
        title: '',
        description: '',
        duration: 60,
        content: 'video',
        contentUrl: ''
      }
    ],
    thumbnail: '',
    status: 'draft'
  });

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUserRole(decodedToken.role);
    if (decodedToken.role !== 'tutor') {
      toast.error('Only instructors can create courses');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (index, field, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value
    };
    setFormData({
      ...formData,
      topics: updatedTopics
    });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [
        ...formData.topics,
        {
          title: '',
          description: '',
          duration: 30,
          content: 'video',
          contentUrl: ''
        }
      ]
    });
  };

  const removeTopic = (index) => {
    const updatedTopics = [...formData.topics];
    updatedTopics.splice(index, 1);
    setFormData({
      ...formData,
      topics: updatedTopics
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const filteredData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        objectives: formData.objectives.filter(obj => obj.trim() !== ''),
        topics: formData.topics.filter(topic => topic.title.trim() !== '')
      };

      filteredData.price = Number(filteredData.price);
      filteredData.duration = Number(filteredData.duration);
      filteredData.topics = filteredData.topics.map(topic => ({
        ...topic,
        duration: Number(topic.duration),
        content: topic.content || 'video',
        contentUrl: topic.contentUrl || ''
      }));

      if (!filteredData.title || !filteredData.description || !filteredData.category ||
        !filteredData.type || !filteredData.duration || !filteredData.difficulty ||
        !filteredData.price) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (filteredData.topics.length === 0) {
        toast.error('Please add at least one topic');
        setLoading(false);
        return;
      }

      for (let i = 0; i < filteredData.topics.length; i++) {
        const topic = filteredData.topics[i];
        if (!topic.title || !topic.description || !topic.duration || !topic.content) {
          toast.error(`Topic ${i + 1} is missing required fields`);
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(
        `${API_URL}/api/courses`,
        filteredData,
        { headers }
      );

      if (response.data && response.data.course) {
        toast.success('Course created successfully!');
        navigate(`/courses/${response.data.course._id}`);
      } else {
        toast.error('Unexpected response format from server');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          toast.error('You do not have permission to create courses. Only instructors can create courses.');
        } else if (error.response.status === 400) {
          const errorMessage = error.response.data.message || 'Validation error';
          const details = error.response.data.details || {};
          const firstError = Object.values(details).find(msg => msg !== null);
          toast.error(firstError || errorMessage);
        } else {
          toast.error(error.response.data.message || 'Failed to create course');
        }
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'tutor') {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
        <div className={`text-center rounded-2xl shadow-lg p-10 ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only instructors can create courses.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-xl shadow hover:scale-105 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold drop-shadow-lg">Create New Course</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-xl shadow hover:scale-105 transition"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="arvr">AR/VR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                rows="4"
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Requirements</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="flex items-center text-[#00CFC1] hover:text-[#007B8A]"
                >
                  <FaPlus className="mr-1" /> Add Requirement
                </button>
              </div>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'} mr-2`}
                    placeholder="Enter requirement"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Objectives */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Objectives</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  className="flex items-center text-[#00CFC1] hover:text-[#007B8A]"
                >
                  <FaPlus className="mr-1" /> Add Objective
                </button>
              </div>
              {formData.objectives.map((obj, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleArrayChange(index, 'objectives', e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'} mr-2`}
                    placeholder="Enter objective"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('objectives', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Topics</h2>
                <button
                  type="button"
                  onClick={addTopic}
                  className="flex items-center text-[#00CFC1] hover:text-[#007B8A]"
                >
                  <FaPlus className="mr-1" /> Add Topic
                </button>
              </div>
              {formData.topics.map((topic, index) => (
                <div key={index} className={`border rounded-xl p-4 mb-4 ${isDarkMode ? 'border-[#22304A] bg-[#1B263B]' : 'border-gray-200 bg-[#F9FAFB]'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Topic {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                        placeholder="Enter topic title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={topic.duration}
                        onChange={(e) => handleTopicChange(index, 'duration', parseInt(e.target.value))}
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                        min="1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={topic.description}
                        onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                        rows="2"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content Type</label>
                      <select
                        value={topic.content}
                        onChange={(e) => handleTopicChange(index, 'content', e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                      >
                        <option value="video">Video</option>
                        <option value="ar">AR</option>
                        <option value="vr">VR</option>
                        <option value="interactive">Interactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content URL</label>
                      <input
                        type="text"
                        value={topic.contentUrl}
                        onChange={(e) => handleTopicChange(index, 'contentUrl', e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#22304A] border-[#22304A] text-white' : 'bg-white border-gray-300'}`}
                        placeholder="https://example.com/content"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-xl font-semibold shadow hover:scale-105 flex items-center transition"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;