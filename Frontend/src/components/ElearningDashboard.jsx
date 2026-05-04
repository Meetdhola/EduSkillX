import React from 'react';
import './ElearningDashboard.css';

// Icon components
const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const VRIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20.69 4.05C18.66 4.73 15.86 5.5 12 5.5c-3.89 0-6.95-.84-8.69-1.43A1.999 1.999 0 0 0 1 6v9.5c0 1.3 1.55 2.44 3.37 3.3 1.8.85 4.12 1.36 6.63 1.42.13.11.26.22.41.32 1.21.74 2.68 1.25 4.18 1.25 1.62 0 3.18-.57 4.44-1.53.41-.31.79-.67 1.12-1.05C23.21 17.99 24 16.3 24 14.5V5c0-1.1-.9-2-2-2-.41 0-.77.16-1.04.39-.8.32-1.64.67-2.5 1-1.26.5-2.67.91-4.27 1.16zm-13.15.88C9.0 5.79 10.42 6 12 6c1.57 0 3.25-.2 5.15-.87-.86.23-1.74.39-2.61.45-1.1.09-2.22.09-3.32 0-.86-.06-1.65-.2-2.46-.4-.08-.03-.17-.05-.25-.08 0-.01.38-.07.79-.12zM20 14.5c0 .83-.34 1.61-.91 2.2-.28.29-.6.53-.94.71-.43.23-.89.38-1.37.42-.31.03-.63.02-.94-.01-.31-.04-.61-.11-.91-.22-.11-.04-.22-.09-.33-.14-.28-.12-.53-.3-.75-.51-.18-.17-.35-.36-.49-.58-.51-.82-.5-1.87-.05-2.72.46-.89 1.28-1.62 2.46-1.68.64-.03 1.25.17 1.81.53a3.478 3.478 0 0 1 1.42 2z" />
  </svg>
);

const MedalIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm0 13H4V4h16v11z M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const ARIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
);

const ProgressBar = ({ percentage, color }) => {
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill" 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color 
        }} 
      />
    </div>
  );
};

const CourseProgress = ({ title, category, percentage, color }) => {
  return (
    <div className="course-progress">
      <div className="course-info">
        <h3>{title}</h3>
        <p>{category}</p>
      </div>
      <div className="course-progress-container">
        <ProgressBar percentage={percentage} color={color} />
        <span className="percentage" style={{ backgroundColor: `${color}20` }}>{percentage}%</span>
      </div>
    </div>
  );
};

const AchievementBadge = ({ icon, color }) => {
  return (
    <div className="achievement-badge" style={{ backgroundColor: `${color}20` }}>
      <span className="achievement-icon" style={{ color }}>
        {icon}
      </span>
    </div>
  );
};

const LeaderboardItem = ({ rank, name, avatar, points }) => {
  return (
    <div className="leaderboard-item">
      <div className="leaderboard-rank">{rank}</div>
      <div className="leaderboard-user">
        <img src={avatar} alt={name} className="avatar-small" />
        <span>{name}</span>
      </div>
      <div className="leaderboard-points">{points} pts</div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <GraduationCapIcon />
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <HomeIcon />
          </a>
          <a href="#" className="nav-item">
            <BookIcon />
          </a>
          <a href="#" className="nav-item">
            <BriefcaseIcon />
          </a>
          <a href="#" className="nav-item">
            <UsersIcon />
          </a>
          <a href="#" className="nav-item">
            <TrophyIcon />
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <nav className="top-nav">
            <a href="#" className="nav-link active">Dashboard</a>
            <a href="#" className="nav-link">Courses</a>
            <a href="#" className="nav-link">Marketplace</a>
            <a href="#" className="nav-link">AI Tutor</a>
            <a href="#" className="nav-link">Rewards</a>
          </nav>
          <div className="user-menu">
            <button className="notification-btn">
              <BellIcon />
              <span className="notification-indicator"></span>
            </button>
            <div className="user-avatar">
              <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="User" />
            </div>
          </div>
        </header>

        <section className="user-profile">
          <div className="profile-info">
            <div className="avatar">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" />
            </div>
            <div className="user-details">
              <h2>Sarah Johnson</h2>
              <p>Frontend Development Path</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value blue">85%</span>
              <span className="stat-label">Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-value purple">12</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value green">1,250</span>
              <span className="stat-label">Points</span>
            </div>
          </div>
        </section>

        <section className="courses-progress">
          <CourseProgress 
            title="Advanced React Patterns" 
            category="Frontend Development" 
            percentage={75} 
            color="#4169E1" 
          />
          <CourseProgress 
            title="UI/UX Fundamentals" 
            category="Design" 
            percentage={45} 
            color="#9370DB" 
          />
          <CourseProgress 
            title="Node.js Masterclass" 
            category="Backend Development" 
            percentage={90} 
            color="#3CB371" 
          />
        </section>

        <section className="learning-options">
          <button className="ar-button">
            <ARIcon /> Start AR Learning
          </button>
          <button className="vr-button">
            <VRIcon /> Enter VR Mode
          </button>
        </section>

        <div className="dashboard-grid">
          <section className="achievements">
            <h2>Recent Achievements</h2>
            <div className="achievements-grid">
              <AchievementBadge icon="🚀" color="#4169E1" />
              <AchievementBadge icon="🏅" color="#9370DB" />
              <AchievementBadge icon="🏆" color="#3CB371" />
            </div>
          </section>

          <section className="leaderboard">
            <h2>Leaderboard</h2>
            <div className="leaderboard-list">
              <LeaderboardItem 
                rank={1} 
                name="Alex M." 
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
                points="2,450" 
              />
              <LeaderboardItem 
                rank={2} 
                name="Emma R." 
                avatar="https://randomuser.me/api/portraits/women/32.jpg"
                points="2,290" 
              />
              <LeaderboardItem 
                rank={3} 
                name="John D." 
                avatar="https://randomuser.me/api/portraits/men/43.jpg"
                points="2,180" 
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;