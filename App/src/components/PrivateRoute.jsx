import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, isAuthenticated, role, requiredRole, ...rest }) => {
  const adminPaths = ['/admin/Dashboard', '/admin/loyaltypoints'];
  
  return isAuthenticated && role === requiredRole ? (
    Component
  ) : (
    <Navigate to={adminPaths.includes(window.location.pathname) ? window.location.pathname : '/login'} />
  );
};

export default PrivateRoute;
