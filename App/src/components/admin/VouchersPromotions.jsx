import React, { useState } from 'react';

const VouchersPromotions = ({ vouchers, handlePost, handleDelete, handleAddVoucher }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    type: 'voucher',
    description: '',
    boost: '',
    duration: '',
    status: 'pending',
  });

  const handleAddMoreClick = () => {
    setShowPopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddVoucher(formData); // Ensure this function is passed correctly
    setShowPopup(false);
  };

  return (
    <div className="vouchers-promotions">
      <h3>Add Vouchers/ Promotions <button className="add-more-button" onClick={handleAddMoreClick}>Add More</button></h3>
      <ul>
        {vouchers.map(voucher => (
          <li key={voucher.id}>
            <span>Promotion: {voucher.description}</span>
            <span>Boost: {voucher.boost}</span>
            <span>Duration: {voucher.duration}</span>
            {voucher.status === 'live' ? (
              <span className="voucher-status live">LIVE</span>
            ) : (
              <button className="post-button" onClick={() => handlePost(voucher.id)}>POST</button>
            )}
            <button className="delete-button" onClick={() => handleDelete(voucher.id)}>DELETE</button>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Voucher/Promotion</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Type:
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="voucher">Voucher</option>
                  <option value="promotion">Promotion</option>
                </select>
              </label>
              <label>
                Name:
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} required />
              </label>
              <label>
                Boost:
                <input type="text" name="boost" value={formData.boost} onChange={handleInputChange} required />
              </label>
              <label>
                Duration:
                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required />
              </label>
              <button type="submit" className="confirm-button">Confirm</button>
              <button type="button" className="cancel-button" onClick={() => setShowPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VouchersPromotions;
