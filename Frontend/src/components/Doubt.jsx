import React, { useState } from 'react';
import './Doubt.css';

function App() {
  // State for form inputs
  const [question, setQuestion] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  
  // Sample data for previously solved doubts
  const solvedDoubts = [
    {
      id: 1,
      question: 'How does useState work in React?',
      answer: 'useState is a React Hook that allows you to add state to functional components...',
      likes: 24,
      tags: ['React', 'JavaScript', 'Hooks']
    }
  ];
  
  // Sample data for mentors
  const mentors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      expertise: 'Mathematics Expert',
      rating: 4.9,
      image: 'https://via.placeholder.com/40'
    },
    {
      id: 2,
      name: 'Prof. Sarah Wilson',
      expertise: 'Physics Expert',
      rating: 4.8,
      image: 'https://via.placeholder.com/40'
    }
  ];

  return (
    <div className="app-container">
      <div className="frame">
        <header className="header">
          <div className="logo">EduSkillX</div>
          <nav className="navigation">
            <a href="#" className="nav-item">Dashboard</a>
            <a href="#" className="nav-item">Courses</a>
            <a href="#" className="nav-item">Rewards</a>
            <a href="#" className="nav-item">AI Tutor</a>
            <a href="#" className="nav-item active">Doubt Session</a>
          </nav>
          <div className="user-profile">
            <div className="notification-icon">🔔</div>
            <div className="profile-image">
              <img src="https://via.placeholder.com/30" alt="User Profile" />
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="doubt-submission">
            <h2 className="section-title">Got a Doubt? Let's Solve It Together! 😊</h2>
            <div className="doubt-form">
              <textarea 
                className="doubt-input" 
                placeholder="Type your question here..." 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
              <div className="form-actions">
                <button className="voice-input-btn">
                  <span className="mic-icon">🎤</span> Voice Input
                </button>
                <button className="attach-file-btn">
                  <span className="paperclip-icon">📎</span> Attach File
                </button>
                <button className="submit-btn">Submit Doubt</button>
              </div>
            </div>
          </section>

          <section className="book-session">
            <h2 className="section-title">Book a 1:1 Doubt Session 📚</h2>
            <div className="session-booking">
              <div className="date-time-selection">
                <div className="form-group">
                  <label>Select Date & Time</label>
                  <input 
                    type="text" 
                    className="date-input" 
                    placeholder="mm/dd/yyyy --:-- --"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Select Subject</label>
                  <select 
                    className="subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>
              
              <div className="mentor-selection">
                <h3>Choose Mentor</h3>
                <div className="mentors-list">
                  {mentors.map(mentor => (
                    <div className="mentor-card" key={mentor.id}>
                      <div className="mentor-info">
                        <img 
                          src={mentor.image} 
                          alt={mentor.name} 
                          className="mentor-image" 
                        />
                        <div className="mentor-details">
                          <div className="mentor-name">{mentor.name}</div>
                          <div className="mentor-expertise">{mentor.expertise}</div>
                        </div>
                      </div>
                      <div className="mentor-rating">
                        <span className="star-icon">⭐</span>
                        <span>{mentor.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="confirm-booking-btn">Confirm Booking</button>
              </div>
            </div>
          </section>

          <section className="solved-doubts">
            <h2 className="section-title">Previously Solved Doubts</h2>
            <div className="search-bar">
              <input type="text" placeholder="Search doubts..." className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="doubts-list">
              {solvedDoubts.map(doubt => (
                <div className="doubt-card" key={doubt.id}>
                  <div className="doubt-content">
                    <h3 className="doubt-question">{doubt.question}</h3>
                    <p className="doubt-answer">{doubt.answer}</p>
                    <div className="doubt-tags">
                      {doubt.tags.map((tag, index) => (
                        <span className="tag" key={index}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="doubt-likes">
                    <span className="like-icon">👍</span>
                    <span className="like-count">{doubt.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-logo">EduSkillX</div>
          <div className="footer-links">
            <a href="#" className="footer-link">Help</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;