import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import AdminDetails from './AdminDetails';
import SystemDetails from './SystemDetails';
import VouchersPromotions from './VouchersPromotions';
import ExecutiveControls from './ExecutiveControls';
import { getUserData } from '../../../utils/userdata';

const Dashboard = () => {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      description: 'Fast Fruits Promotion',
      boost: '2x Points Conversion Rate',
      duration: 'NIL',
      status: 'live',
    },
    {
      id: 2,
      description: 'Limited Time Offer for Royal Air Members',
      boost: '2x Points Conversion Rate',
      duration: 'Ends 4 AUG 2359HRS',
      status: 'pending',
    },
    {
      id: 3,
      description: 'Gold RUSH Competition: GOLDEN TICKET',
      boost: '2x Points Conversion Rate',
      duration: 'NIL',
      status: 'pending',
    },
  ]);

  const [userData, setUserData] = useState({
    email: '',
  });

  const [showExecutiveControls, setShowExecutiveControls] = useState(true);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const handlePost = (voucherId) => {
    setVouchers(vouchers.map(voucher =>
      voucher.id === voucherId ? { ...voucher, status: 'live' } : voucher
    ));
  };

  const handleDelete = (voucherId) => {
    setVouchers(vouchers.filter(voucher => voucher.id !== voucherId));
  };

  const handleAddVoucher = (newVoucher) => {
    const newId = Date.now(); // Use current timestamp as a unique ID
    setVouchers([...vouchers, { id: newId, ...newVoucher }]);
  };

  const toggleExecutiveControls = () => {
    setShowExecutiveControls(!showExecutiveControls);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-top">
          <AdminDetails />
          <SystemDetails />
        </div>
        <VouchersPromotions
          vouchers={vouchers}
          handlePost={handlePost}
          handleDelete={handleDelete}
          handleAddVoucher={handleAddVoucher}
        />
        <button onClick={toggleExecutiveControls}>
          {showExecutiveControls ? 'Hide Executive Controls' : 'Show Executive Controls'}
        </button>
        {showExecutiveControls && <ExecutiveControls />}
      </div>
    </div>
  );
};

export default Dashboard;
