import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaSearch, FaUserCircle, FaClock } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/messages/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URI}/messages/${conversationId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URI}/messages/${selectedConversation._id}`,
                { content: newMessage },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            conv.participant.Fullname.firstname.toLowerCase().includes(searchTerm) ||
            conv.participant.Fullname.lastname.toLowerCase().includes(searchTerm) ||
            conv.participant.email.toLowerCase().includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

                        <div className="space-y-4 mb-8">
                            {messages.map(message => (
                                <div
                                    key={message._id}
                                    className={`flex ${
                                        message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-lg rounded-lg px-4 py-2 ${
                                            message.sender._id === user?._id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={message.sender.avatar || 'https://via.placeholder.com/40'}
                                                alt={message.sender.name}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <span className="font-semibold">{message.sender.name}</span>
                                        </div>
                                        <p>{message.content}</p>
                                        <span className="text-xs opacity-75 mt-1 block">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages; 