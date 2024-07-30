import React from 'react';
import rewardIcon from '../../assets/GRAPHIC_ASSETS/GRAPHIC_GOLDEN_BONE_TIER.svg'

const TierProgress = () => {
    return (
      <div className="tier-info">
        <h3>Tier I : Bronze</h3>
        <div className="tier-progress-container">
          <div className="tier-progress">
            <div className="progress-bar">
              <div className="progress" style={{ width: '20%' }}></div>
            </div>
            <img src={rewardIcon} alt="Reward Icon" className="reward-icon" />
          </div>
          <p>Treats Left to Tier II : Silver <span>80</span></p>
          <div className="reward-details">
            <p>Reward for completing this tier: <span>1x Golden Bone</span></p>
            <button className="claim-button">CLAIM</button>
          </div>
        </div>
      </div>
    );
};

export default TierProgress;
