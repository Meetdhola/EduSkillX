import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  useEffect(() => {
    // Load chat history
    const loadChatHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([{
            text: "Hello! I'm your EduSkillX AI Assistant. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        setMessages([{
          text: "Hello! I'm your EduSkillX AI Assistant. How can I help you today?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
      }
    };

    loadChatHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        userMessage: input,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTimeout(() => {
        setIsTyping(false);
        setLoading(false);

        const aiMessage = {
          text: res.data.reply,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
      setIsTyping(false);
      setLoading(false);

      setMessages(prev => [...prev, {
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] flex items-center justify-center py-10 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 rounded-2xl shadow-lg max-w-3xl w-full flex flex-col h-[80vh] border border-[#F0F4F8]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-8 py-6 border-b border-[#E5E7EB]">
          <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-br from-[#00CFC1] via-[#007B8A] to-[#FFC857]">
            <FaRobot className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D3B66] drop-shadow-lg">EduSkillX AI Assistant</h1>
            <p className="text-gray-500 text-sm">Your personal learning companion</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="bg-gradient-to-br from-[#00CFC1] to-[#007B8A] p-2 rounded-full mr-2 self-start">
                    <FaRobot className="text-white text-base" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-xl px-5 py-3 shadow text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white'
                      : 'bg-[#F0F4F8] text-[#0D3B66]'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-[#B2F7EF]' : 'text-[#007B8A]'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-[#00CFC1] to-[#007B8A] p-2 rounded-full mr-2 self-start">
                <FaRobot className="text-white text-base" />
              </div>
              <div className="bg-[#F0F4F8] rounded-xl px-5 py-3 shadow text-[#0D3B66]">
                <div className="flex space-x-2">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-[#00CFC1] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-[#00CFC1] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-[#00CFC1] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white/80 rounded-b-2xl">
          <div className="flex items-center bg-[#F0F4F8] rounded-xl px-3 py-2">
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent border-none outline-none text-[#0D3B66] placeholder-gray-400 resize-none py-2 px-3 max-h-32"
              rows={1}
              placeholder="Ask me anything about your courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 ml-2 rounded-full bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIChat;