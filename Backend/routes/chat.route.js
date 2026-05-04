// routes/chat.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Store chat history in memory (for development purposes)
// In production, this should be stored in a database
let chatHistory = {};

// Get chat history for a user
router.get('/chat/history', async (req, res) => {
  try {
    // In a real implementation, you would get the user ID from the auth token
    // and fetch their chat history from a database
    const userId = req.user ? req.user.id : 'default';
    
    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }
    
    res.json({ messages: chatHistory[userId] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send a message to the AI
router.post('/chat', async (req, res) => {
  const { userMessage } = req.body;
  
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // In a real implementation, you would get the user ID from the auth token
    const userId = req.user ? req.user.id : 'default';
    
    // Add user message to history
    const userMessageObj = {
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }
    
    chatHistory[userId].push(userMessageObj);
    
    // Call the AI service
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // you can use mistral or command-r-plus too
      messages: [
        { role: 'system', content: 'You are a helpful educational assistant for EduSkillX platform. Help users with their learning journey.' },
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    
    // Add AI response to history
    const aiMessageObj = {
      text: reply,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    
    chatHistory[userId].push(aiMessageObj);
    
    res.json({ reply });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
