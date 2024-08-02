import React, { useEffect, useState } from 'react';
import defaultProfilePicture from '../../assets/FETCH_LOGOS/FETCH_LOGO_MAIN.svg';
import { fetchUserDetails } from '../../../utils/api';

const AdminDetails = () => {
  const [admin, setAdmin] = useState({
    name: 'Bank Admin',
    email: 'secret@gmail.com',
    contact: '+88880101',
    lastLogin: '',
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const userId = sessionStorage.getItem('id');
      const userDetails = await fetchUserDetails(userId);
      if (userDetails) {
        setAdmin({
          ...admin,
          lastLogin: new Date(userDetails.lastLogin).toLocaleString(),
        });
      }
    };

    fetchAdminDetails();
  }, []);

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
