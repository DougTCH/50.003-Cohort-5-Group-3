import React from 'react';

const SystemDetails = () => {
  return (
    <div className="system-details">
      <h3>System Details</h3>
      <p>Core System Status: <span className="status-online">MongoDB online</span></p>
      <p>View Company Policies: <a href="/policies" target="_blank" rel="noopener noreferrer">FETCH Policies</a></p>
      <p>Last updated at 31 JUL 2024 2359HRS</p>
    </div>
  );
};

export default SystemDetails;
