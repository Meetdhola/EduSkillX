import React, { useState } from 'react';
import './Smartnotes.css'; // We'll add the CSS separately

const EduSkillX = () => {
  const [wordCount, setWordCount] = useState(50);
  
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">EduSkillX</div>
        <nav className="navigation">
          <a href="#dashboard">Dashboard</a>
          <a href="#courses">Courses</a>
          <a href="#rewards">Rewards</a>
          <a href="#ai-tutor">AI Tutor</a>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="hero-section">
          <h1>AI-Powered Smart Notes & Summaries</h1>
          <p className="subtitle">Instantly generate key takeaways and concise notes from your lessons.</p>
        </section>
        
        <section className="upload-section">
          <div className="upload-container">
            <div className="upload-area">
              <div className="cloud-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#4285f4" viewBox="0 0 16 16">
                  <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                  <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
              </div>
              <p>Upload your files (PDF, DOCX, PPT) or paste text</p>
              <button className="choose-file-btn">Choose File</button>
            </div>
            
            <button className="generate-btn">
              <span className="lightning-icon">⚡</span>
              Generate Notes
            </button>
          </div>
        </section>
        
        <section className="summary-section">
          <div className="summary-container">
            <div className="summary-header">
              <h2>Generated Summary</h2>
              <div className="summary-actions">
                <button className="action-btn download-btn">Download</button>
                <button className="action-btn share-btn">Share</button>
                <button className="action-btn save-btn">Save</button>
              </div>
            </div>
            
            <div className="summary-controls">
              <div className="length-control">
                <label>Summary Length:</label>
                <select 
                  value={wordCount} 
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                >
                  <option value={50}>50 words</option>
                  <option value={100}>100 words</option>
                  <option value={200}>200 words</option>
                </select>
              </div>
              
              <button className="rewrite-btn">Rewrite in Simple Terms</button>
            </div>
            
            <div className="summary-content">
              <p>Your AI-generated summary will appear here...</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="footer-logo">EduSkillX</div>
        <div className="footer-links">
          <a href="#terms">Terms & Policies</a>
          <a href="#help">Help Center</a>
          <a href="#feedback">Feedback</a>
        </div>
      </footer>
    </div>
  );
};

export default EduSkillX;