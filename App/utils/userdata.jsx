// utils/user.js
export const getUserData = () => {
    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    const points = sessionStorage.getItem('points');
    const user_id = sessionStorage.getItem('id');
    return {
      user_id: user_id || '',
      firstName: firstName || '',
      lastName: lastName || '',
      points: points ? parseInt(points, 10) : 0,
    };
  };
  