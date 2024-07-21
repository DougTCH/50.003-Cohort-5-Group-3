import React, { useState } from 'react';
import './LoyaltyPoints.css';
import Bridge from './LP_Bridge';
import Transaction from './LP_Transaction';
import Dashboard from './empty/Dashboard';
import Explore from './empty/Explore';
// import Dashboard from './Dashboard';
// import Explore from './Explore';

function LoyaltyPoints() {
  const [currentSection, setCurrentSection] = useState('');
  
 

  return (
    <div className="container">
      <div className="wrapper">
        <div className="TC-bar">
          <button className="TC-link" onClick={() => setCurrentSection('bridge')}>Bridge</button>
          <button className="TC-link" onClick={() => setCurrentSection('transaction')}>Transaction</button>
          <button className="TC-link" onClick={() => setCurrentSection('dashboard')}>Dashboard</button>
          <button className="TC-link" onClick={() => setCurrentSection('explore')}>Explore</button>
        </div>

        {currentSection === 'bridge' && <Bridge />}
        {currentSection === 'transaction' && <Transaction />}
        {currentSection === 'dashboard' && <Dashboard />}
        {currentSection === 'explore' && <Explore />}
      </div>
    </div>
  );
}

export default LoyaltyPoints;

