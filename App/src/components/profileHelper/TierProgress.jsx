import React from 'react';

const TierProgress = () => {
  return (
    <div className="tier-info">
      <h3>Tier I : Bronze</h3>
      <div className="tier-progress">
        <div className="progress-bar">
          <div className="progress" style={{ width: '20%' }}></div>
        </div>
        <p>Treats Left to Tier II : Silver <span>80</span></p>
        <p>Reward for completing this tier: <span>1x Golden Bone</span></p>
        <button className="claim-button">CLAIM</button>
      </div>
    </div>
  );
};

export default TierProgress;
