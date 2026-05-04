import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaClock, FaBook, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Roadmap.css';

const Roadmap = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    currentLevel: 'beginner',
    learningGoals: [],
    preferredLearningStyle: 'visual',
    timeAvailability: 'part-time',
    interests: [],
    completedCourses: []
  });

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      toast.error('Please login to access the roadmap');
      navigate('/login');
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'learningGoals' || name === 'interests') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          `${API_URL}/api/roadmap/generate`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        );
        if (response.data) {
          setRoadmap(response.data.roadmap);
          setShowForm(false);
          toast.success('Your personalized roadmap has been generated!');
        }
      } catch (error) {
        // fallback to mock data
        const mockRoadmap = generateMockRoadmap(formData);
        setRoadmap(mockRoadmap);
        setShowForm(false);
        toast.success('Your personalized roadmap has been generated in offline mode.', {
          duration: 5000,
          icon: '🔄'
        });
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate mock roadmap data
  const generateMockRoadmap = (formData) => {
    const { currentLevel, learningGoals, preferredLearningStyle, timeAvailability, interests } = formData;
    const phaseCount = timeAvailability === 'full-time' ? 4 : timeAvailability === 'part-time' ? 6 : 5;
    const phases = [];
    let startIndex = 0;
    if (currentLevel === 'intermediate') startIndex = 1;
    else if (currentLevel === 'advanced') startIndex = 2;
    for (let i = 0; i < phaseCount; i++) {
      const phaseIndex = startIndex + i;
      const phaseNumber = i + 1;
      const duration = timeAvailability === 'full-time' ? '2 weeks' : timeAvailability === 'part-time' ? '4 weeks' : '3 weeks';
      const topics = [];
      const topicCount = 3;
      for (let j = 0; j < topicCount; j++) {
        const topicIndex = (phaseIndex * topicCount) + j;
        const interest = interests[topicIndex % interests.length] || 'Programming';
        topics.push({
          title: `${interest} Fundamentals ${j + 1}`,
          description: `Learn the fundamentals of ${interest} and how to apply them in real-world scenarios.`,
          resources: [
            { title: `Course: Introduction to ${interest}`, url: '#' },
            { title: 'Practice Exercises', url: '#' },
            { title: 'Additional Resources', url: '#' }
          ]
        });
      }
      const milestones = [];
      const milestoneCount = 3;
      for (let k = 0; k < milestoneCount; k++) {
        let milestone = '';
        if (learningGoals.includes('Career Change')) {
          milestone = `Complete ${k + 1} project${k > 0 ? 's' : ''} to build your portfolio`;
        } else if (learningGoals.includes('Professional Certification')) {
          milestone = `Prepare for ${k + 1} certification exam${k > 0 ? 's' : ''}`;
        } else if (learningGoals.includes('Skill Enhancement')) {
          milestone = `Master ${k + 1} key concept${k > 0 ? 's' : ''} in this phase`;
        } else {
          milestone = `Complete ${k + 1} learning module${k > 0 ? 's' : ''}`;
        }
        milestones.push(milestone);
      }
      phases.push({
        title: `Phase ${phaseNumber}: ${getPhaseTitle(phaseIndex, learningGoals)}`,
        duration,
        description: getPhaseDescription(phaseIndex, learningGoals),
        topics,
        milestones
      });
    }
    const nextSteps = `Start with ${phases[0].title} and focus on the first topic. `;
    if (interests.includes('Web Development')) {
      return { phases, nextSteps: nextSteps + 'Consider enrolling in our web development courses to get started.' };
    } else if (interests.includes('Data Science')) {
      return { phases, nextSteps: nextSteps + 'Consider enrolling in our data science courses to get started.' };
    } else if (interests.includes('Mobile Development')) {
      return { phases, nextSteps: nextSteps + 'Consider enrolling in our mobile development courses to get started.' };
    } else {
      return { phases, nextSteps: nextSteps + 'Browse our course catalog to find courses that match your interests.' };
    }
  };

  // Helper function to get phase title based on index and learning goals
  const getPhaseTitle = (phaseIndex, learningGoals) => {
    const titles = [
      'Foundation Building',
      'Core Concepts',
      'Advanced Techniques',
      'Specialization',
      'Mastery',
      'Expert Level'
    ];
    if (learningGoals.includes('Career Change')) {
      return 'Career Transition ' + titles[phaseIndex % titles.length];
    } else if (learningGoals.includes('Professional Certification')) {
      return 'Certification Preparation ' + titles[phaseIndex % titles.length];
    } else {
      return titles[phaseIndex % titles.length];
    }
  };

  // Helper function to get phase description based on index and learning goals
  const getPhaseDescription = (phaseIndex, learningGoals) => {
    const descriptions = [
      'Build a strong foundation with essential concepts and skills.',
      'Deepen your understanding of core principles and techniques.',
      'Explore advanced concepts and specialized techniques.',
      'Focus on specific areas of expertise and specialization.',
      'Achieve mastery through advanced projects and challenges.',
      'Reach expert level with cutting-edge knowledge and skills.'
    ];
    if (learningGoals.includes('Career Change')) {
      return 'Transition your career by ' + descriptions[phaseIndex % descriptions.length].toLowerCase();
    } else if (learningGoals.includes('Professional Certification')) {
      return 'Prepare for certification by ' + descriptions[phaseIndex % descriptions.length].toLowerCase();
    } else {
      return descriptions[phaseIndex % descriptions.length];
    }
  };

  const handleRegenerateRoadmap = () => {
    setShowForm(true);
    setRoadmap(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D3B66] mb-4 drop-shadow-lg">
            Your Learning Roadmap
          </h1>
          <p className="text-lg text-gray-500">
            Get a personalized learning path based on your goals and preferences.
          </p>
        </div>

        {showForm ? (
          <div className="bg-white/80 rounded-2xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Current Level */}
              <div>
                <label className="block text-lg font-semibold text-[#0D3B66] mb-4">
                  What's your current level?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label
                      key={level}
                      className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.currentLevel === level
                          ? 'border-[#00CFC1] bg-[#F0F4F8]'
                          : 'border-[#E5E7EB] hover:border-[#00CFC1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="currentLevel"
                        value={level}
                        checked={formData.currentLevel === level}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-lg font-medium capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Learning Goals */}
              <div>
                <label className="block text-lg font-semibold text-[#0D3B66] mb-4">
                  What are your learning goals?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Career Change',
                    'Skill Enhancement',
                    'Personal Interest',
                    'Professional Certification',
                    'Project-Based Learning',
                    'Research/Academic'
                  ].map((goal) => (
                    <label
                      key={goal}
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.learningGoals.includes(goal)
                          ? 'border-[#00CFC1] bg-[#F0F4F8]'
                          : 'border-[#E5E7EB] hover:border-[#00CFC1]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="learningGoals"
                        value={goal}
                        checked={formData.learningGoals.includes(goal)}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-lg">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div>
                <label className="block text-lg font-semibold text-[#0D3B66] mb-4">
                  What's your preferred learning style?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { value: 'visual', label: 'Visual' },
                    { value: 'auditory', label: 'Auditory' },
                    { value: 'reading', label: 'Reading/Writing' },
                    { value: 'kinesthetic', label: 'Hands-on' }
                  ].map((style) => (
                    <label
                      key={style.value}
                      className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.preferredLearningStyle === style.value
                          ? 'border-[#00CFC1] bg-[#F0F4F8]'
                          : 'border-[#E5E7EB] hover:border-[#00CFC1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredLearningStyle"
                        value={style.value}
                        checked={formData.preferredLearningStyle === style.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-lg">{style.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Availability */}
              <div>
                <label className="block text-lg font-semibold text-[#0D3B66] mb-4">
                  How much time can you dedicate to learning?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'part-time', label: 'Part-time (5-10 hrs/week)' },
                    { value: 'full-time', label: 'Full-time (20+ hrs/week)' },
                    { value: 'flexible', label: 'Flexible Schedule' }
                  ].map((time) => (
                    <label
                      key={time.value}
                      className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.timeAvailability === time.value
                          ? 'border-[#00CFC1] bg-[#F0F4F8]'
                          : 'border-[#E5E7EB] hover:border-[#00CFC1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timeAvailability"
                        value={time.value}
                        checked={formData.timeAvailability === time.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-lg text-center">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-lg font-semibold text-[#0D3B66] mb-4">
                  What are your main interests?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    'Web Development',
                    'Mobile Development',
                    'Data Science',
                    'AI/ML',
                    'Cloud Computing',
                    'Cybersecurity',
                    'Game Development',
                    'UI/UX Design',
                    'Blockchain'
                  ].map((interest) => (
                    <label
                      key={interest}
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.interests.includes(interest)
                          ? 'border-[#00CFC1] bg-[#F0F4F8]'
                          : 'border-[#E5E7EB] hover:border-[#00CFC1]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-lg">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                >
                  Generate Roadmap
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8">
            {roadmap ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <h2 className="text-2xl font-bold text-[#0D3B66]">
                    Your Personalized Learning Path
                  </h2>
                  <button
                    onClick={handleRegenerateRoadmap}
                    className="text-[#00CFC1] hover:text-[#007B8A] font-semibold underline transition"
                  >
                    Regenerate Roadmap
                  </button>
                </div>

                <div className="space-y-6">
                  {roadmap.phases.map((phase, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-[#00CFC1] pl-6 py-4 bg-[#F9FAFB] rounded-xl shadow mb-4"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00CFC1] to-[#007B8A] text-white rounded-full flex items-center justify-center font-bold shadow">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-[#0D3B66] ml-4">
                          {phase.title}
                        </h3>
                        <span className="ml-4 text-[#007B8A] flex items-center">
                          <FaClock className="inline mr-1" />
                          {phase.duration}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{phase.description}</p>

                      <div className="space-y-4">
                        {phase.topics.map((topic, topicIndex) => (
                          <div
                            key={topicIndex}
                            className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center gap-4"
                          >
                            <div className="flex-shrink-0 flex items-center">
                              <FaBook className="text-[#00CFC1] text-xl" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-[#007B8A]">
                                {topic.title}
                              </h4>
                              <p className="text-gray-600 mt-1">
                                {topic.description}
                              </p>
                              {topic.resources && (
                                <div className="mt-3">
                                  <h5 className="text-sm font-semibold text-[#0D3B66] mb-2">
                                    Recommended Resources:
                                  </h5>
                                  <ul className="space-y-2">
                                    {topic.resources.map((resource, resourceIndex) => (
                                      <li
                                        key={resourceIndex}
                                        className="flex items-center text-sm text-[#00CFC1] hover:text-[#007B8A] transition"
                                      >
                                        <FaArrowRight className="mr-2" />
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {resource.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {phase.milestones && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-[#0D3B66] mb-3">
                            Milestones
                          </h4>
                          <ul className="space-y-2">
                            {phase.milestones.map((milestone, milestoneIndex) => (
                              <li
                                key={milestoneIndex}
                                className="flex items-center text-gray-600"
                              >
                                <FaCheckCircle className="text-[#00CFC1] mr-2" />
                                {milestone}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-br from-[#00CFC1]/10 to-[#007B8A]/5 rounded-xl shadow">
                  <h3 className="text-xl font-semibold text-[#0D3B66] mb-4">
                    Next Steps
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {roadmap.nextSteps}
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                  >
                    Browse Courses
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No roadmap generated yet. Please fill out the form to get your personalized learning path.
                </p>
                <button
                  onClick={handleRegenerateRoadmap}
                  className="mt-4 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                >
                  Generate Roadmap
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;