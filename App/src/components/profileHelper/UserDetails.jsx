import React from 'react';
import defaultProfilePicture from '../../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';
import { getUserData } from '../../../utils/userdata';

const UserDetails = () => {
  const user = getUserData();

  return (
    <div className="profile-card">
      <div className="profile-picture">
        <img src={defaultProfilePicture} alt="Profile" />
      </div>
      <div className="profile-details">
        <h2>{user.firstName} {user.lastName}</h2>
        <p>Email: john.doe@example.com</p>
        <p className="bank-points">Bank Points Balance: <span>{user.points}</span></p>
        <p className="golden-bones">Golden Bones: <span>0</span></p>
        <button className="edit-profile-button">Edit Profile</button>
      </div>
    </div>
  );
};

export default UserDetails;
