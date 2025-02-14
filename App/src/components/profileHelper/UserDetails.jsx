import React, { useState } from 'react';
import defaultProfilePicture from '../../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';
import { getUserData } from '../../../utils/userdata';

const UserDetails = ({ goldenBones }) => {
  const user = getUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('Please update your number');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Save the mobile number to the user's data (this would typically involve an API call)
  };

  const handleInputChange = (event) => {
    setMobileNumber(event.target.value);
  };

  return (
    <div className="profile-card">
      <div className="profile-top-section">
        <div className="profile-picture">
          <img src={defaultProfilePicture} alt="Profile" />
        </div>
        <div className="profile-details">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>Email: john.doe@example.com</p>
          <p>
            Mobile Number:  
            {isEditing ? (
              <input 
                type="text" 
                value={mobileNumber} 
                onChange={handleInputChange}
                placeholder="Enter a Valid Number"
              />
            ) : (
              mobileNumber
            )}
          </p>
        </div>
        <button className="edit-profile-button" onClick={isEditing ? handleSaveClick : handleEditClick}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="profile-bottom-section">
        <p className="bank-points">Bank Points Balance: <span>{user.points}</span></p>
      </div>
      <div className="golden-bones-section">
        <p className="golden-bones">Golden Bones: <span>{goldenBones}</span></p>
      </div>
    </div>
  );
};

export default UserDetails;
