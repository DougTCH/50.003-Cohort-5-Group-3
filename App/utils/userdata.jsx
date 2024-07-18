// utils/user.js
export const getUserData = () => {
    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    const points = sessionStorage.getItem('points');
    return {
      firstName: firstName || '',
      lastName: lastName || '',
      points: points ? parseInt(points, 10) : 0,
    };
  };
  