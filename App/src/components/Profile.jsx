import React from 'react';
import './profile.css';
import UserDetails from './profileHelper/UserDetails';
import TierProgress from './profileHelper/TierProgress';
import Tasks from './profileHelper/Tasks';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-top">
          <UserDetails />
          <TierProgress />
        </div>
        <Tasks />
      </div>
    </div>
  );
};

export default Profile;
