// src/components/Notifications.js
import React from 'react';
import './notifications.css';

//Cheng Ye: putting in some default stuff first

function Notifications() {
  const notifications = [
    { id: 1, message: "Your account balance is low." },
    { id: 2, message: "New promotional offer available!" },
    { id: 3, message: "Your last transaction was successful." },
  ];

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
