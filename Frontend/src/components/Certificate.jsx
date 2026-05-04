import React from 'react';

const Certification = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #eaeaea'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '18px',
              marginRight: '5px'
            }}>🔐</span>
            <span style={{ fontWeight: 'bold' }}>EduSkillX</span>
          </div>
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px'
            }}>
              <span style={{ marginRight: '5px' }}>📊</span>
              <span>Dashboard</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px'
            }}>
              <span style={{ marginRight: '5px' }}>📚</span>
              <span>Courses</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4361ee'
            }}>
              <span style={{ marginRight: '5px' }}>🏆</span>
              <span>Certifications</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px'
            }}>
              <span style={{ marginRight: '5px' }}>🤖</span>
              <span>AI Tutor</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{
          backgroundImage: 'linear-gradient(rgba(240, 245, 255, 0.9), rgba(240, 245, 255, 0.9)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FFFFFF\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23FFFFFF\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id=\'b\' width=\'300\' height=\'300\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'150\' cy=\'150\' r=\'120\' fill=\'none\' stroke=\'url(%23a)\' stroke-opacity=\'0.5\' stroke-width=\'2\'/%3E%3C/pattern%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23b)\'/%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          padding: '50px 20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '28px',
            color: '#1a365d',
            margin: '0 0 10px 0'
          }}>
            Verify Your Skills with <br />
            Blockchain-Powered <br />
            Certifications
          </h1>
          <p style={{
            color: '#4a5568',
            fontSize: '14px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Secure, immutable, and instantly verifiable certificates for your achievements
          </p>
        </div>

        {/* Verification Form */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '20px',
            width: '300px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                Certificate ID
              </label>
              <input
                type="text"
                placeholder="Enter your certificate ID"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button style={{
              backgroundColor: '#4361ee',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              width: '100%',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Verify Now
            </button>
          </div>
        </div>

        {/* Certificate Details */}
        <div style={{
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid #eaeaea'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  margin: '0',
                  color: '#2d3748'
                }}>
                  Certificate Details
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '10px',
                  backgroundColor: '#e9f5f2',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#38a169'
                }}>
                  <span style={{ marginRight: '5px' }}>🟢</span>
                  <span>Verified on Blockchain</span>
                </div>
              </div>
              <button style={{
                backgroundColor: 'transparent',
                color: '#4361ee',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span style={{ marginRight: '5px' }}>👁</span>
                <span>View on Chain</span>
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <div style={{
                flex: '1',
                minWidth: '250px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '5px'
                  }}>
                    Certificate Holder
                  </label>
                  <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    Sarah Anderson
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '5px'
                  }}>
                    Course Completed
                  </label>
                  <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    Advanced Blockchain Development
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '5px'
                  }}>
                    Issue Date
                  </label>
                  <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    March 15, 2023
                  </p>
                </div>
              </div>

              <div style={{
                flex: '1',
                minWidth: '250px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  border: '1px solid #eaeaea',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  maxWidth: '300px',
                  backgroundColor: '#0f172a',
                  padding: '10px'
                }}>
                  <img 
                    src="/api/placeholder/280/180" 
                    alt="Certificate Preview" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button style={{
                backgroundColor: '#4361ee',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '5px' }}>⬇️</span>
                <span>Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;