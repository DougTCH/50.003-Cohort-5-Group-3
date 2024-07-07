import React from 'react';
import './LoyaltyPoints.css';
import { useState } from 'react';

function LoyaltyPoints() {
  const [currentSection, setCurrentSection] = useState('')

  return (
    <>
    <div className="container">
      <img src=""></img>
      <div className="TC-bar">
        <button className="TC-link" onClick={() => setCurrentSection('bridge')}>Bridge</button>
        <button className="TC-link" onClick={() => setCurrentSection('transaction')}>Transaction</button>
        <button className="TC-link" onClick={() => setCurrentSection('dashboard')}>Dashboard</button>
        <button className="TC-link" onClick={() => setCurrentSection('explore')}>Explore</button>
      </div>
    </div>

    {currentSection === 'bridge' && (
      <section id="bridge-section" className="section">
        <div>
          <p>Sender</p>
        </div>
        <div className="fetch-box">
          <img src="/assets/BankLogo.svg" alt="Bank Logo" />
          Fetch
        </div>
      </section>
    )}

    {currentSection === 'transaction' && (
      <section id="bridge-section" className="section">
      </section>
    )}
    
    {currentSection === 'dashboard' && (
      <section id="bridge-section" className="section">
      </section>
    )}

    </>
    
   
  );
}


export default LoyaltyPoints;
