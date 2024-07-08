import React from 'react';
import home_background from '../assets/home_advert.png';

function Home() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <img src={home_background} alt="Home" style={{ width: '100%' }} />
      <div
        className="text"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          padding: '10px',
      
        }}
      >
        <h1>Home</h1>
        <p>Welcome to the Home page.</p>
      </div>
    </div>
  );
}

export default Home;
