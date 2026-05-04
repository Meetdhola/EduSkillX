import React from 'react';
import './Rewards.css';

const EduSkillXDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎓</span> EduSkillX
        </div>
        <nav className="navigation">
          <button className="nav-button">Dashboard</button>
          <button className="nav-button">Courses</button>
          <button className="nav-button active">Rewards</button>
          <button className="nav-button">AI Tutor</button>
        </nav>
      </header>

      <section className="top-performers">
        <h2>Top Performers</h2>
        <div className="performers-list">
          <div className="performer-card">
            <span className="rank">#1</span>
            <div className="performer-avatar">
              <img src="/api/placeholder/40/40" alt="Alex Mitchell" />
            </div>
            <div className="performer-info">
              <h3>Alex Mitchell</h3>
              <span className="points">2,450 points</span>
            </div>
          </div>

          <div className="performer-card">
            <span className="rank">#2</span>
            <div className="performer-avatar">
              <img src="/api/placeholder/40/40" alt="Sarah Chen" />
            </div>
            <div className="performer-info">
              <h3>Sarah Chen</h3>
              <span className="points">2,280 points</span>
            </div>
          </div>

          <div className="performer-card">
            <span className="rank">#3</span>
            <div className="performer-avatar">
              <img src="/api/placeholder/40/40" alt="James Wilson" />
            </div>
            <div className="performer-info">
              <h3>James Wilson</h3>
              <span className="points">2,150 points</span>
            </div>
          </div>
        </div>
      </section>

      <section className="achievements">
        <h2>Your Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">★</div>
            <h3>Quick Learner</h3>
            <p>Completed 5 courses</p>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">🔥</div>
            <h3>Streak Master</h3>
            <p>30 days streak</p>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">👑</div>
            <h3>Top Performer</h3>
            <p>Ranked #1 in week</p>
          </div>

          <div className="achievement-card locked">
            <div className="achievement-icon">💎</div>
            <h3>Complete 20 courses</h3>
            <button className="unlock-button">Unlock Now</button>
          </div>
        </div>
      </section>

      <section className="rewards-banner">
        <h2>Ready to Claim Your Rewards?</h2>
        <p>
          Transform your learning achievements into exciting rewards. Unlock exclusive 
          content, certificates, and more!
        </p>
        <button className="view-rewards-button">View All Rewards</button>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-icon">🎓</span> EduSkillX
        </div>
        <div className="copyright">
          © 2025 EduSkillX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default EduSkillXDashboard;