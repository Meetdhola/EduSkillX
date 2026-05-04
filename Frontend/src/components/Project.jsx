import React from 'react';
import './ProjectsPage.css';

const ProjectsPage = () => {
  return (
    <div className="projects-container">
      <header className="header">
        <div className="logo">EduSkillX</div>
        <nav className="nav-menu">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Projects</a>
          <a href="#" className="nav-link">Learn</a>
          <a href="#" className="nav-link">Community</a>
        </nav>
        <div className="user-controls">
          <div className="notifications">
            <i className="notification-icon">🔔</i>
          </div>
          <div className="user-avatar">
            <img src="/avatar-placeholder.jpg" alt="User profile" />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="page-title">Apply Your Skills to Real Projects</h1>
            <p className="page-subtitle">Work on micro-internships & freelance gigs to gain hands-on experience.</p>
            
            <div className="cta-buttons">
              <button className="btn primary-btn">
                <span className="btn-icon">+</span> Post a Project
              </button>
              <button className="btn secondary-btn">
                <span className="btn-icon">🔍</span> Browse Projects
              </button>
            </div>
          </div>
        </section>

        <section className="featured-projects">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <div className="section-controls">
              <button className="control-btn filter-btn">
                <span className="filter-icon">▼</span> Filter
              </button>
              <button className="control-btn sort-btn">
                <span className="sort-icon">↕</span> Sort
              </button>
            </div>
          </div>
          
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-header">
                <div className="project-main-info">
                  <h3 className="project-title">UI/UX Design for EdTech App</h3>
                  <p className="project-company">TechStart Solutions</p>
                </div>
                <div className="project-badge paid">Paid</div>
              </div>
              
              <div className="project-meta">
                <div className="duration">
                  <span className="meta-icon">⏱</span> 2 Weeks
                </div>
              </div>
              
              <div className="project-tags">
                <span className="tag">Figma</span>
                <span className="tag">UI Design</span>
                <span className="tag">Prototyping</span>
              </div>
              
              <button className="apply-btn">Apply Now</button>
            </div>
            
            <div className="project-card">
              <div className="project-header">
                <div className="project-main-info">
                  <h3 className="project-title">Web Development Project</h3>
                  <p className="project-company">GreenEarth NGO</p>
                </div>
                <div className="project-badge unpaid">Unpaid</div>
              </div>
              
              <div className="project-meta">
                <div className="duration">
                  <span className="meta-icon">⏱</span> 1 Month
                </div>
              </div>
              
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">MongoDB</span>
              </div>
              
              <button className="apply-btn">Apply Now</button>
            </div>
            
            <div className="project-card">
              <div className="project-header">
                <div className="project-main-info">
                  <h3 className="project-title">Content Writing</h3>
                  <p className="project-company">StartupX</p>
                </div>
                <div className="project-badge paid">Paid</div>
              </div>
              
              <div className="project-meta">
                <div className="duration">
                  <span className="meta-icon">⏱</span> 3 Weeks
                </div>
              </div>
              
              <div className="project-tags">
                <span className="tag">SEO</span>
                <span className="tag">Copywriting</span>
                <span className="tag">Research</span>
              </div>
              
              <button className="apply-btn">Apply Now</button>
            </div>
          </div>
        </section>

        <section className="applications-section">
          <h2 className="section-title">My Applications</h2>
          
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>UI/UX Design for EdTech App</td>
                  <td>TechStart Solutions</td>
                  <td>
                    <span className="status-badge pending">Pending</span>
                  </td>
                  <td>
                    <button className="action-btn">
                      <span className="message-icon">💬</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Content Writing</td>
                  <td>StartupX</td>
                  <td>
                    <span className="status-badge accepted">Accepted</span>
                  </td>
                  <td>
                    <button className="action-btn">
                      <span className="message-icon">💬</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">EduSkillX</div>
            <p className="footer-tagline">Connecting students with real-world projects and opportunities.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-menu">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Projects</a></li>
                <li><a href="#">How it Works</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-menu">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-heading">Connect</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="social-icon">𝕏</i>
                </a>
                <a href="#" className="social-link">
                  <i className="social-icon">in</i>
                </a>
                <a href="#" className="social-link">
                  <i className="social-icon">📷</i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="copyright">
          © 2025 EduSkillX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProjectsPage;