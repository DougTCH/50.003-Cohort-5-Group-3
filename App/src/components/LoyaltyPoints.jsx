import React, { useState } from 'react';
import './LoyaltyPoints.css';
import Bridge from './LP_Bridge';
import Transaction from './LP_Transaction';
// import Dashboard from './Dashboard';
// import Explore from './Explore';

function LoyaltyPoints() {
  const [currentSection, setCurrentSection] = useState('');
  
  const options = [
    { value: 'move', label: 'BestMovers' },
    { value: 'city', label: 'CityGreen' },
    { value: 'fast', label: 'FastFruits' },
    { value: 'fresh', label: 'FreshBag' },
    { value: 'cart', label: 'GoCart' },
    { value: 'gold', label: 'GoldenHotels' },
    { value: 'hnh', label: 'HisAndHers' },
    { value: 'king', label: 'KingsmanServices' },
    { value: 'lion', label: 'NationalBanking' },
    { value: 'pay', label: 'PassionPay' },
    { value: 'house', label: 'PremiumSteakHouse' },
    { value: 'royal', label: 'RoyalAir' },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '60px',
      minHeight: '60px',
      borderColor: state.isFocused ? '#0f1537' : '#0f1537',
      '&:hover': {
        borderColor: '#0f1537',
      },
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '400px',
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: '0',
      border: '1px solid #0f1537',
      width: '100%',
      maxWidth: '400px',
    }),
    menuList: (provided) => ({
      ...provided,
      width: '100%',
      maxWidth: '400px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'gray',
      fontSize: '16px',
      fontStyle: 'italic',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
      display: 'flex',
      alignItems: 'center',
    }),
    options: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: state.isSelected ? '#888888' : state.isFocused ? '#888888' : 'white',
      color: '#1A1E43',
      '&:hover': {
        backgroundColor: '#fffffff',
      },
    }),
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="TC-bar">
          <button className="TC-link" onClick={() => setCurrentSection('bridge')}>Bridge</button>
          <button className="TC-link" onClick={() => setCurrentSection('transaction')}>Transaction</button>
          <button className="TC-link" onClick={() => setCurrentSection('dashboard')}>Dashboard</button>
          <button className="TC-link" onClick={() => setCurrentSection('explore')}>Explore</button>
        </div>

        {currentSection === 'bridge' && <Bridge options={options} customStyles={customStyles} />}
        {currentSection === 'transaction' && <Transaction />}
        {currentSection === 'dashboard' && <Dashboard />}
        {currentSection === 'explore' && <Explore />}
      </div>
    </div>
  );
}

export default LoyaltyPoints;

