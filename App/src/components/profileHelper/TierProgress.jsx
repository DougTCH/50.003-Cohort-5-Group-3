import React, { useEffect, useState } from 'react';
import axios from 'axios';
import rewardIcon from '../../assets/GRAPHIC_ASSETS/GRAPHIC_GOLDEN_BONE_TIER.svg';
import { getUserData } from '../../../utils/userdata';

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


const TierProgress = ({ tasks = [], setGoldenBones, goldenBones, userId }) => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);
  const [unclaimedBones, setUnclaimedBones] = useState(0);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
    user_id: ''
  });

  useEffect(() => {
    try {
      const data = getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []); // Missing dependency array added

  useEffect(() => {
    const totalPoints = tasks.reduce((acc, task) => task.status === 'done' ? acc + task.points : acc, 0);

    let newPoints = totalPoints;
    let newTierIndex = 0;

    while (newPoints >= 100 && newTierIndex < tiers.length - 1) {
      newPoints -= 100;
      newTierIndex += 1;
    }

    if (newTierIndex > currentTierIndex) {
      setUnclaimedBones(prev => prev + (newTierIndex - currentTierIndex));
      updateTier(userData.user_id, newTierIndex); // Call the API to update tier after calculating

    }
    setCurrentPoints(newPoints);
    setCurrentTierIndex(newTierIndex);
  }, [tasks, currentTierIndex, userData.user_id]);

  const updateTier = async (userId, newTier) => {
    try {
      await axios.post(`http://localhost:5001/api/update_tier/${userId}`, 
      { newTier });
      console.log('Tier updated successfully');
      sessionStorage.setItem('tier', newTier);
      console.log("tier is :", sessionStorage.getItem('tier'));
    } catch (error) {
      console.error('Error updating tier:', error);
    }
  };

  const progressPercentage = (currentPoints / 100) * 100;

  const handleClaim = () => {
    if (unclaimedBones > 0) {
      setGoldenBones(goldenBones + 1);
      setUnclaimedBones(unclaimedBones - 1);
    }
  };
  const resetTier = () => {
    sessionStorage.setItem('tier', 0);
    console.log("tier is :", sessionStorage.getItem('tier'));

  }


  
  

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
          <button className="claim-button" onClick={resetTier} disabled={unclaimedBones === 0}>
            CLAIM
          </button>
          <button onClick={resetTier}>
            Reset Tier
          </button>
        </div>
        {unclaimedBones > 0 && (
          <p className="unclaimed-bones-message">You have {unclaimedBones} unclaimed {unclaimedBones > 1 ? 'bones' : 'bone'}</p>
        )}
      </div>
    </div>
  );
};

export default TierProgress;
