const axios = require('axios');
const Chat = require('../models/Chat');

const chatController = {
  async handleChat(req, res) {
    try {
      const { userMessage } = req.body;
      const userId = req.user.id;
      
      if (!userMessage) {
        return res.status(400).json({ message: 'Message is required' });
      }

      // Call OpenRouter API
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are EduSkillX AI Assistant, a helpful educational assistant. Provide clear, concise, and accurate responses focused on helping students learn.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL,
          'X-Title': 'EduSkillX'
        }
      });

      const aiResponse = response.data.choices[0].message.content;

      // Save chat history
      let chat = await Chat.findOne({ userId });
      
      if (!chat) {
        chat = new Chat({ userId });
      }

      chat.messages.push(
        { text: userMessage, sender: 'user' },
        { text: aiResponse, sender: 'ai' }
      );

      await chat.save();

      res.json({ reply: aiResponse });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        message: error.response?.data?.message || 'Error processing your request'
      });
    }
  },

  async getChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const chat = await Chat.findOne({ userId });
      
      if (!chat) {
        return res.json({ messages: [] });
      }

      res.json({ messages: chat.messages });
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({ message: 'Error fetching chat history' });
    }
  }
};

module.exports = chatController; 