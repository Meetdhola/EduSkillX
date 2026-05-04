import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      backgroundColor: '#f3f4f6', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Header Navigation */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '20px 40px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#4169e1'
          }}>
            EduSkillX
          </div>
          
          <nav style={{ 
            display: 'flex', 
            gap: '30px',
            alignItems: 'center'
          }}>
            <a href="#home" style={{ textDecoration: 'none', color: '#333' }}>Home</a>
            <a 
              onClick={() => navigate('/courses')} 
              style={{ textDecoration: 'none', color: '#333', cursor: 'pointer' }}
            >
              Courses
            </a>
            <a href="#marketplace" style={{ textDecoration: 'none', color: '#333' }}>Marketplace</a>
            <a href="#ai-tutor" style={{ textDecoration: 'none', color: '#333' }}>AI Tutor</a>
            <a href="#contact" style={{ textDecoration: 'none', color: '#333' }}>Contact</a>
          </nav>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ 
              padding: '8px 20px',
              border: '1px solid #4169e1',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              color: '#4169e1',
              cursor: 'pointer'
            }}>
              Login
            </button>
            <button style={{ 
              padding: '8px 20px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: '#4169e1',
              color: 'white',
              cursor: 'pointer'
            }}>
              Sign Up
            </button>
          </div>
        </header>
        
        {/* Hero Section */}
        <section style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(240, 240, 255, 0.9), rgba(230, 230, 255, 0.9)), url("/api/placeholder/1200/600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 40px',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '500',
              color: '#333',
              marginBottom: '20px',
              lineHeight: '1.4'
            }}>
              Transform your learning journey with cutting-edge AR/VR technology and AI-powered tutoring. Exchange skills, earn certifications, and evolve your career.
            </h1>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button 
                onClick={() => navigate('/elearning-dashboard')}
                style={{ 
                padding: '12px 25px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: '#4169e1',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Get Started
              </button>
              <button style={{ 
                padding: '12px 25px',
                borderRadius: '25px',
                border: '1px solid #4169e1',
                backgroundColor: 'transparent',
                color: '#4169e1',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Explore Courses
              </button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section style={{ padding: '60px 40px' }}>
          <h2 style={{ 
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '60px'
          }}>
            Revolutionary Learning Features
          </h2>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            gap: '30px'
          }}>
            {/* Feature 1 */}
            <div style={{ 
              flex: '1',
              padding: '30px 20px',
              borderRight: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 3H3v7h7V3z"></path>
                  <path d="M21 3h-7v7h7V3z"></path>
                  <path d="M21 14h-7v7h7v-7z"></path>
                  <path d="M10 14H3v7h7v-7z"></path>
                  <rect x="7" y="7" width="10" height="10" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h3 
                onClick={() => navigate('/arvr')}
                style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}
              >
                AR/VR Learning
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>
                Immerse yourself in interactive 3D environments for enhanced learning experiences.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div style={{ 
              flex: '1',
              padding: '30px 20px',
              borderRight: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5"></path>
                  <path d="M8 21H3v-5"></path>
                  <path d="M21 3l-7 7"></path>
                  <path d="M3 21l7-7"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                Skill Barter
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>
                Exchange knowledge and skills with peers in our innovative marketplace.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div style={{ 
              flex: '1',
              padding: '30px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 00-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                AI Tutor
              </h3>
              <p style={{ color: '#666', lineHeight: '1.5' }}>
                Get personalized learning assistance powered by advanced AI technology.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer style={{ 
          padding: '40px',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ maxWidth: '400px' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#4169e1',
              marginBottom: '20px'
            }}>
              EduSkillX
            </div>
            <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
              Transform your learning journey with cutting-edge technology and personalized education.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#twitter" style={{ color: '#333' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#facebook" style={{ color: '#333' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#instagram" style={{ color: '#333' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#linkedin" style={{ color: '#333' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div style={{ maxWidth: '400px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Subscribe to Our Newsletter
            </h3>
            <div style={{ 
              display: 'flex',
              gap: '10px'
            }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{
                  flex: '1',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <button style={{ 
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#4169e1',
                color: 'white',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;