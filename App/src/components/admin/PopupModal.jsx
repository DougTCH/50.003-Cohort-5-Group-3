import React, { useEffect } from 'react';

const PopupModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <div className="popup-modal">
      <div className="popup-inner">
        <pre>{message}</pre> 
      </div>
    </div>
  );
};

export default PopupModal;