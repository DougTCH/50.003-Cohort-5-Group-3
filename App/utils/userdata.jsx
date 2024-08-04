// utils/user.js
export const getUserData = () => {
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const points = sessionStorage.getItem('points');
  const user_id = sessionStorage.getItem('id');
  const mobileNumber = sessionStorage.getItem('mobileNumber');
  const tier = sessionStorage.getItem('tier');
  const membershipIDs = JSON.parse(sessionStorage.getItem('membershipIDs')) || [];
  const vouchers = JSON.parse(sessionStorage.getItem('vouchers')) || [];

  return {
    user_id: user_id || '',
    firstName: firstName || '',
    lastName: lastName || '',
    points: points ? parseInt(points, 10) : 0,
    mobileNumber: mobileNumber || '',
    tier: tier ? parseInt(tier, 10) : 0,
    membershipIDs,
    vouchers,
  };
};
  