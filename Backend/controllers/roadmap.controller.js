const axios = require('axios');
require('dotenv').config();

const generateRoadmap = async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Validate form data
    if (!formData || !formData.currentLevel || !formData.learningGoals || !formData.preferredLearningStyle || !formData.timeAvailability || !formData.interests) {
      return res.status(400).json({ message: 'Missing required form data' });
    }

    // Call OpenRouter API to generate roadmap
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: "You are an expert educational advisor specializing in creating personalized learning roadmaps. Generate a detailed, structured roadmap based on the user's input."
        },
        {
          role: "user",
          content: `Create a learning roadmap with the following details:
            Current Level: ${formData.currentLevel}
            Learning Goals: ${formData.learningGoals.join(', ')}
            Learning Style: ${formData.preferredLearningStyle}
            Time Availability: ${formData.timeAvailability}
            Interests: ${formData.interests.join(', ')}
            
            The roadmap should include:
            1. A clear progression path
            2. Specific learning objectives for each phase
            3. Recommended resources and activities
            4. Estimated timeframes
            5. Milestones and checkpoints
            
            Format the response as a JSON object with the following structure:
            {
              "phases": [
                {
                  "title": "Phase title",
                  "duration": "Estimated duration",
                  "description": "Phase description",
                  "topics": [
                    {
                      "title": "Topic title",
                      "description": "Topic description",
                      "resources": [
                        {
                          "title": "Resource title",
                          "url": "Resource URL"
                        }
                      ]
                    }
                  ],
                  "milestones": ["Milestone 1", "Milestone 2", ...]
                }
              ],
              "nextSteps": "Immediate next steps for the user"
            }`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse the AI response
    const roadmapData = JSON.parse(response.data.choices[0].message.content);

    res.json({ roadmap: roadmapData });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ message: 'Error generating roadmap', error: error.message });
  }
};

module.exports = {
  generateRoadmap
}; 