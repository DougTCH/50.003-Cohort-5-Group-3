import React, { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserPoints } from '../../../utils/api';

const ExecutiveControls = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tierPoints, setTierPoints] = useState(0);
  const [bankPoints, setBankPoints] = useState(0);
  const [voucherInjections, setVoucherInjections] = useState(0);

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAndSetUsers();
  }, []);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find(user => user._id === userId);
    setSelectedUser(user);
  };

  const handleUpdatePoints = async () => {
    if (selectedUser) {
      try {
        await updateUserPoints(selectedUser._id, {
          tierPoints,
          bankPoints,
          voucherInjections
        });
        alert('User points updated successfully!');
      } catch (error) {
        console.error('Error updating user points:', error);
        alert('Failed to update points.');
      }
    } else {
      alert('Please select a user');
    }
  };

  return (
    <div className="executive-controls">
      <h2>Executive Controls</h2>
      <div className="user-selection">
        <label>Select User:</label>
        <select onChange={handleUserChange} value={selectedUser ? selectedUser._id : ''}>
          <option value="" disabled>Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div className="points-injection">
          <label>
            Tier Points:
            <input
              type="number"
              value={tierPoints}
              onChange={(e) => setTierPoints(parseInt(e.target.value))}
            />
          </label>
          <label>
            Bank Points:
            <input
              type="number"
              value={bankPoints}
              onChange={(e) => setBankPoints(parseInt(e.target.value))}
            />
          </label>
          <label>
            Voucher Injections:
            <input
              type="number"
              value={voucherInjections}
              onChange={(e) => setVoucherInjections(parseInt(e.target.value))}
            />
          </label>
          <button onClick={handleUpdatePoints}>Update Points</button>
        </div>
      )}
    </div>
  );
};

export default ExecutiveControls;
