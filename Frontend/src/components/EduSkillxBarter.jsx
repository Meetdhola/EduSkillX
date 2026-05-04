import React, { useState, useEffect } from 'react';
import {
  FaExchangeAlt, FaBook, FaUserGraduate, FaClock, FaSearch, FaFilter, FaComments,
  FaHandshake, FaCheck, FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EduSkillx.css';
import './EduSkillXBarter.css';

const EduSkillXBarter = () => {
  const [barterItems, setBarterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [barterProposals, setBarterProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [usersWithCourses, setUsersWithCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  // Function to check if a course is already exchanged
  const isCourseExchanged = (courseId) => {
    return barterProposals.some(proposal =>
      (proposal.offeredCourse._id === courseId || proposal.requestedCourse?._id === courseId) &&
      proposal.status === 'accepted'
    );
  };

  // Function to get exchanged course details
  const getExchangedCourseDetails = (courseId) => {
    const proposal = barterProposals.find(proposal =>
      (proposal.offeredCourse._id === courseId || proposal.requestedCourse?._id === courseId) &&
      proposal.status === 'accepted'
    );
    if (!proposal) return null;
    return {
      exchangedWith: proposal.offeredCourse._id === courseId ? proposal.requestedCourse : proposal.offeredCourse,
      partner: proposal.offeredCourse._id === courseId ? proposal.toUser : proposal.fromUser
    };
  };

  useEffect(() => {
    fetchEnrolledCourses();
    fetchBarterProposals();
    fetchUsersWithCourses();
    // eslint-disable-next-line
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/courses/user/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEnrolledCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Failed to load enrolled courses');
    }
  };

  const fetchUsersWithCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/barter/users-with-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsersWithCourses(response.data.users);
    } catch (error) {
      console.error('Error fetching users with courses:', error);
      toast.error('Failed to load users with available courses');
    }
  };

  const fetchBarterProposals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/barter/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBarterProposals(response.data.proposals);
    } catch (error) {
      console.error('Error fetching barter proposals:', error);
      toast.error('Failed to load barter proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateBarter = async (courseId) => {
    try {
      setSelectedCourseId(courseId);
      setShowUserSelection(true);
    } catch (error) {
      console.error('Error initiating barter:', error);
      toast.error('Failed to initiate barter');
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get current user ID from token
      const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
      
      // Prevent users from selecting themselves
      if (userId === currentUserId) {
        toast.error('You cannot create a barter proposal with yourself');
        return;
      }

      console.log('Creating proposal with:', {
        offeredCourseId: selectedCourseId,
        toUserId: userId
      });

      // Create a new proposal
      const response = await axios.post(`${API_URL}/api/barter/proposals`, {
        offeredCourseId: selectedCourseId,
        toUserId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedProposal(response.data.proposal);
      setShowUserSelection(false);
      setSelectedUser(null);
      setSelectedCourseId(null);
      toast.success('Barter proposal created successfully');
      fetchBarterProposals(); // Refresh proposals
    } catch (error) {
      console.error('Error creating barter proposal:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create barter proposal';
      toast.error(errorMessage);
      console.log('Error details:', error.response?.data);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/api/barter/proposals/${proposalId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBarterProposals(prev => 
        prev.map(p => p._id === proposalId ? { ...p, status: 'accepted' } : p)
      );

      // Set the selected proposal and fetch chat messages
      setSelectedProposal(response.data.proposal);
      fetchChatMessages(proposalId);
      setShowChat(true);

      toast.success('Barter proposal accepted! You can now start exchanging knowledge.');
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast.error('Failed to accept proposal');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`${API_URL}/api/barter/proposals/${proposalId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBarterProposals(prev => 
        prev.map(p => p._id === proposalId ? { ...p, status: 'rejected' } : p)
      );

      toast.success('Barter proposal rejected');
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast.error('Failed to reject proposal');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProposal?._id) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_URL}/api/barter/proposals/${selectedProposal._id}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatMessages(prev => [...prev, response.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const fetchChatMessages = async (proposalId) => {
    if (!proposalId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/barter/proposals/${proposalId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChatMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast.error('Failed to load chat messages');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderChatModal = () => {
    if (!selectedProposal || !showChat) return null;

  return (
      <div className="chat-modal">
        <div className="chat-content">
          <div className="chat-header">
            <h3>Chat with {selectedProposal.fromUser?.name || 'User'}</h3>
            <button
              onClick={() => {
                setShowChat(false);
                setSelectedProposal(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.map(message => (
              <div
                key={message._id}
                className={`message ${
                  message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'
                }`}
              >
                <p>{message.content}</p>
                <div className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  };

  // --- UI starts here ---
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] py-10 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-[#0D3B66] tracking-tight drop-shadow-lg flex items-center gap-2">
            <FaExchangeAlt className="text-[#00CFC1]" /> EduSkillX Barter
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-2 rounded-xl font-semibold shadow transition ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white scale-105'
                  : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveTab('my-courses')}
              className={`px-5 py-2 rounded-xl font-semibold shadow transition ${
                activeTab === 'my-courses'
                  ? 'bg-gradient-to-r from-[#FFC857] to-[#00CFC1] text-white scale-105'
                  : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#FFF9E5]'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-5 py-2 rounded-xl font-semibold shadow transition ${
                activeTab === 'proposals'
                  ? 'bg-gradient-to-r from-[#007B8A] to-[#00CFC1] text-white scale-105'
                  : 'bg-[#F0F4F8] text-[#0D3B66] hover:bg-[#E5F9F7]'
              }`}
            >
              Proposals
            </button>
          </div>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            <div className="bg-white/80 rounded-xl shadow-md p-5 mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search courses to learn..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#F9FAFB] shadow focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  className="appearance-none bg-[#F0F4F8] text-[#0D3B66] px-5 py-2 pr-8 rounded-xl font-semibold shadow focus:outline-none focus:ring-2 focus:ring-[#00CFC1]"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Categories</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map(course => (
                  <div key={course._id} className="bg-white/90 rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition border border-transparent hover:border-[#00CFC1]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#F0F4F8] rounded-full">
                        <FaBook className="text-[#00CFC1]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D3B66]">{course.title}</h3>
                        <p className="text-xs text-[#007B8A]">{course.category}</p>
                      </div>
                      <span className="ml-auto text-xs bg-[#00CFC1]/10 text-[#00CFC1] px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <div className="w-full bg-[#F0F4F8] rounded-full h-2 mb-1">
                      <div
                        className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Progress: {course.progress}%</p>
                    <button
                      onClick={() => handleInitiateBarter(course._id)}
                      className="mt-2 w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white py-2 px-4 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                    >
                      <FaExchangeAlt className="mr-2" />
                      Offer to Exchange
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No courses found matching your criteria.
                </div>
              )}
            </div>
          </>
        )}

        {/* My Courses Tab */}
        {activeTab === 'my-courses' && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
            <h3 className="text-xl font-bold text-[#0D3B66] mb-6 flex items-center gap-2">
              <FaBook className="text-[#00CFC1]" /> My Enrolled Courses
            </h3>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course._id} className="bg-[#F9FAFB] rounded-xl shadow p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#F0F4F8] rounded-full">
                        <FaBook className="text-[#00CFC1]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D3B66]">{course.title}</h3>
                        <p className="text-xs text-[#007B8A]">{course.category}</p>
                      </div>
                      <span className="ml-auto text-xs bg-[#00CFC1]/10 text-[#00CFC1] px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <div className="w-full bg-[#F0F4F8] rounded-full h-2 mb-1">
                      <div
                        className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Progress: {course.progress}%</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Enrolled: {formatDate(course.enrolledAt)}
                      </span>
                      <button
                        onClick={() => handleInitiateBarter(course._id)}
                        className="text-xs text-[#00CFC1] hover:text-[#007B8A] underline transition"
                      >
                        Offer to Exchange
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                You haven't enrolled in any courses yet.
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
            <h3 className="text-xl font-bold text-[#0D3B66] mb-6 flex items-center gap-2">
              <FaHandshake className="text-[#00CFC1]" /> Barter Proposals
            </h3>
            {barterProposals.length > 0 ? (
              <div className="space-y-6">
                {barterProposals.map(proposal => (
                  <div key={proposal._id} className="bg-[#F9FAFB] rounded-xl shadow p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={proposal.fromUser.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        alt={proposal.fromUser.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-[#0D3B66]">
                          {proposal.fromUser.name}
                        </h3>
                        <p className="text-xs text-[#007B8A]">
                          Wants to exchange knowledge
                        </p>
                      </div>
                      <span className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold shadow ${
                        proposal.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : proposal.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 shadow">
                        <h4 className="text-sm font-medium text-[#0D3B66]">They Offer</h4>
                        <p className="text-sm text-gray-600">{proposal.offeredCourse?.title || 'No course selected'}</p>
                        <div className="mt-2 w-full bg-[#F0F4F8] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] h-2 rounded-full"
                            style={{ width: `${proposal.offeredCourse?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow">
                        <h4 className="text-sm font-medium text-[#0D3B66]">They Want</h4>
                        <p className="text-sm text-gray-600">{proposal.requestedCourse?.title || 'No course selected yet'}</p>
                        <div className="mt-2 w-full bg-[#F0F4F8] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] h-2 rounded-full"
                            style={{ width: `${proposal.requestedCourse?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {proposal.status === 'pending' && (
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleRejectProposal(proposal._id)}
                          className="px-4 py-2 text-sm rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition flex items-center"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAcceptProposal(proposal._id)}
                          className="px-4 py-2 text-sm rounded-lg bg-[#00CFC1]/10 text-[#00CFC1] hover:bg-[#00CFC1]/20 transition flex items-center"
                        >
                          <FaCheck className="mr-1" />
                          Accept
                        </button>
                      </div>
                    )}
                    {proposal.status === 'accepted' && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setSelectedProposal(proposal);
                            fetchChatMessages(proposal._id);
                            setShowChat(true);
                          }}
                          className="w-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white py-2 px-4 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
                        >
                          <FaComments className="mr-2" />
                          Open Chat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No barter proposals yet.
              </div>
            )}
          </div>
        )}

        {/* Chat Modal */}
        {showChat && selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0D3B66]">
                  Chat with {selectedProposal.fromUser?.name || 'User'}
                </h3>
                <button
                  onClick={() => {
                    setShowChat(false);
                    setSelectedProposal(null);
                  }}
                  className="text-gray-400 hover:text-[#0D3B66] transition"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="h-64 overflow-y-auto bg-[#F9FAFB] rounded-lg p-3 mb-4">
                {chatMessages.map(message => (
                  <div
                    key={message._id}
                    className={`mb-2 flex ${message.sender._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-xl shadow text-sm ${
                      message.sender._id === localStorage.getItem('userId')
                        ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white'
                        : 'bg-white text-[#0D3B66]'
                    }`}>
                      {message.content}
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] bg-[#F9FAFB] text-[#0D3B66]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* User Selection Modal */}
        {showUserSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              <h2 className="text-xl font-bold text-[#0D3B66] mb-4">Select User to Exchange With</h2>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {usersWithCourses.length > 0 ? (
                  usersWithCourses.map(user => (
                    <div
                      key={user._id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#E5F9F7] cursor-pointer transition"
                      onClick={() => handleSelectUser(user._id)}
                    >
                      <img
                        src={user.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        alt={user.Fullname?.firstname || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-[#0D3B66]">
                          {user.Fullname?.firstname} {user.Fullname?.lastname}
                        </h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No users with available courses found.</p>
                )}
              </div>
              <button
                className="mt-6 w-full px-5 py-2 rounded-xl font-semibold bg-[#F0F4F8] text-[#0D3B66] shadow hover:bg-[#E5F9F7] transition"
                onClick={() => {
                  setShowUserSelection(false);
                  setSelectedCourseId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EduSkillXBarter;