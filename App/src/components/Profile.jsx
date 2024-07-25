import React from 'react';
import './profile.css';
import defaultProfilePicture from '../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-picture">
          <img src={defaultProfilePicture} alt="Profile" />
        </div>
        <div className="profile-details">
          <h2>John Doe</h2>
          <p>Email: john.doe@example.com</p>
          <button className="edit-profile-button">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
