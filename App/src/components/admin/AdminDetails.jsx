import React from 'react';
import defaultProfilePicture from '../../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';

const AdminDetails = () => {
  const admin = {
    name: 'Bank Admin',
    email: 'secret@gmail.com',
    contact: '+88880101',
    lastLogin: '1 Aug 2024 0945HRS',
  };

  return (
    <div className="admin-details">
      <div className="admin-card">
        <div className="admin-top-section">
            <div className="admin-picture">
                <img src={defaultProfilePicture} alt="Profile" />
            </div>
            <div className="admin-info">
                <h2>{admin.name}</h2>
                <p>Email: {admin.email}</p>
                <p>IT Support: {admin.contact}</p>
            </div>
        </div>
        <div className="admin-last-login">
            <p>Last Login: {admin.lastLogin}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
