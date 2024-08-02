import React, { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserPoints } from '../../../utils/api';
import PopupModal from './PopupModal';

const ExecutiveControls = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tierPoints, setTierPoints] = useState(0);
  const [bankPoints, setBankPoints] = useState(0);
  const [voucherInjections, setVoucherInjections] = useState(0);
  const [popupMessage, setPopupMessage] = useState(null);

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
      const parsedTierPoints = parseInt(tierPoints) || 0;
      const parsedBankPoints = parseInt(bankPoints) || 0;
      const parsedVoucherInjections = parseInt(voucherInjections) || 0;

      if (isNaN(parsedTierPoints) || isNaN(parsedBankPoints) || isNaN(parsedVoucherInjections)) {
        alert('Please enter valid numbers');
        return;
      }

      try {
        const result = await updateUserPoints(selectedUser._id, {
          tierPoints: parsedTierPoints,
          bankPoints: parsedBankPoints,
          voucherInjections: parsedVoucherInjections
        });
        const { user } = result;  // Updated here to correctly extract user from response
        setPopupMessage(
          `Points added: ${parsedBankPoints}\nTier points added: ${parsedTierPoints}\nVouchers added: ${parsedVoucherInjections}`
        );
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      } catch (error) {
        console.error('Error updating user points:', error);
        setPopupMessage('Failed to update points.');
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      }
    } else {
      setPopupMessage('Please select a user');
      setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
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
              onChange={(e) => setTierPoints(e.target.value)}
            />
          </label>
          <label>
            Bank Points:
            <input
              type="number"
              value={bankPoints}
              onChange={(e) => setBankPoints(e.target.value)}
            />
          </label>
          <label>
            Voucher Injections:
            <input
              type="number"
              value={voucherInjections}
              onChange={(e) => setVoucherInjections(e.target.value)}
            />
          </label>
          <button onClick={handleUpdatePoints}>Update Points</button>
        </div>
      )}
      {popupMessage && (
        <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </div>
  );
};

export default ExecutiveControls;
