import React from 'react';
import './AdminLoyaltyPoints.css';

const AdminLoyaltyPoints = () => {
  return (
    <div className="admin-loyalty-points">
      <h1>Admin Loyalty Points</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>1200</td>
            <td>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>950</td>
            <td>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
      <div className="button-container">
        <button>Add New User</button>
      </div>
    </div>
  );
};

export default AdminLoyaltyPoints;
