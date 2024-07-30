import React, { useEffect, useState } from 'react';
import rewardIcon from '../../assets/GRAPHIC_ASSETS/GRAPHIC_GOLDEN_BONE_TIER.svg';

const tiers = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Diamond',
  'Conqueror',
  'Vanguard',
  'Titan'
];

const TierProgress = ({ tasks = [] }) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);

  useEffect(() => {
    const totalPoints = tasks.reduce((acc, task) => task.status === 'done' ? acc + task.points : acc, 0);

    let newPoints = totalPoints;
    let newTierIndex = 0;

    while (newPoints >= 100 && newTierIndex < tiers.length - 1) {
      newPoints -= 100;
      newTierIndex += 1;
    }

    setCurrentPoints(newPoints);
    setCurrentTierIndex(newTierIndex);
  }, [tasks]);

  const progressPercentage = (currentPoints / 100) * 100;

  return (
    <div className="tier-info">
      <h3>Tier {currentTierIndex + 1} : {tiers[currentTierIndex]}</h3>
      <div className="tier-progress-container">
        <div className="tier-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <img src={rewardIcon} alt="Reward Icon" className="reward-icon" />
        </div>
        {currentTierIndex < tiers.length - 1 && (
          <p>Treats Left to Tier {currentTierIndex + 2} : {tiers[currentTierIndex + 1]} <span>{100 - currentPoints}</span></p>
        )}
        <div className="reward-details">
          <p>Reward for completing this tier: <span>1x Golden Bone</span></p>
          <button className="claim-button">CLAIM</button>
        </div>
      </div>
    </div>
  );
};

export default TierProgress;
