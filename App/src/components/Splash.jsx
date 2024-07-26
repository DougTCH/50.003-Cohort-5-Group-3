// Splash.jsx
import React, { useEffect } from 'react';
import './splash.css';
import splashLogo from '../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';

const Splash = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-page">
      <img className="splash-logo" src={splashLogo} alt="Splash Logo" />
      <h1 className="splash-text">FINANCE'S BEST FRIEND</h1>
    </div>
  );
};

export default Splash;
