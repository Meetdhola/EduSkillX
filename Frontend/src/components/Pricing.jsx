import React, { useState } from 'react';
import './EduSkillXPricing.css';

const EduSkillXPricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: 'John Doe',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted', paymentDetails);
    // Handle form submission logic here
  };

  return (
    <div className="pricing-container">
      <header className="header">
        <div className="logo">EduSkillX</div>
        <nav className="navigation">
          <button className="nav-button">
            <span className="nav-icon">⌂</span> Dashboard
          </button>
          <button className="nav-button">
            <span className="nav-icon">📚</span> Courses
          </button>
          <button className="nav-button active">
            <span className="nav-icon">💳</span> Payments
          </button>
          <button className="nav-button">
            <span className="nav-icon">🤖</span> AI Tutor
          </button>
        </nav>
      </header>

      <main className="main-content">
        <h1 className="page-title">Choose Your Plan</h1>
        
        <div className="pricing-plans">
          <div className={`plan-card ${selectedPlan === 'basic' ? 'selected' : ''}`} onClick={() => setSelectedPlan('basic')}>
            <h2 className="plan-name">Basic</h2>
            <div className="plan-price">
              <span className="dollar-sign">$</span>
              <span className="price">0</span>
              <span className="period">/month</span>
            </div>
            
            <ul className="features-list">
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Access to 5 courses
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Basic AI support
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Community access
              </li>
            </ul>
            
            <button className="plan-button basic">Get Started</button>
          </div>

          <div className={`plan-card ${selectedPlan === 'pro' ? 'selected' : ''}`} onClick={() => setSelectedPlan('pro')}>
            <h2 className="plan-name">Pro</h2>
            <div className="plan-price">
              <span className="dollar-sign">$</span>
              <span className="price">29</span>
              <span className="period">/month</span>
            </div>
            
            <ul className="features-list">
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Unlimited courses
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Advanced AI tutor
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Priority support
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Certificates
              </li>
            </ul>
            
            <button className="plan-button pro">Subscribe Now</button>
          </div>

          <div className={`plan-card ${selectedPlan === 'enterprise' ? 'selected' : ''}`} onClick={() => setSelectedPlan('enterprise')}>
            <h2 className="plan-name">Enterprise</h2>
            <div className="plan-price">
              <span className="dollar-sign">$</span>
              <span className="price">99</span>
              <span className="period">/month</span>
            </div>
            
            <ul className="features-list">
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Everything in Pro
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Custom AI solutions
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Dedicated support
              </li>
              <li className="feature-item">
                <span className="check-icon">✓</span>
                Team management
              </li>
            </ul>
            
            <button className="plan-button enterprise">Contact Sales</button>
          </div>
        </div>

        <div className="payment-section">
          <h2 className="section-title">Payment Details</h2>
          
          <div className="payment-providers">
            <div className="provider stripe">stripe</div>
            <div className="provider credit-card">
              <span className="credit-card-icon">💳</span>
            </div>
          </div>
          
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input 
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={paymentDetails.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input 
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input 
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              
              <div className="form-group half">
                <label htmlFor="cvv">CVV</label>
                <input 
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            
            <div className="secure-checkout">
              <span className="lock-icon">🔒</span> Secure Checkout
            </div>
            
            <button type="submit" className="payment-button">Complete Payment</button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p className="copyright">© 2025 EduSkillX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EduSkillXPricing;