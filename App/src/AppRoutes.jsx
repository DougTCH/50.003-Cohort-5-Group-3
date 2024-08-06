import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import MyAccounts from './components/empty/MyAccounts';
import Transfer from './components/empty/Transfer';
import Pay from './components/empty/Pay';
import Cards from './components/empty/Cards';
import Apply from './components/empty/Apply';
import LoyaltyPoints from './components/LoyaltyPoints';
import Login from './components/Login';
import Register from './components/Register';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/Dashboard';
import AdminLoyaltyPoints from './components/admin/AdminLoyaltyPoints';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = ({ isAuthenticated, role, onLogin, onLogout, showSplash, handleSplashFinish }) => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!showSplash && !isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, showSplash, navigate, location.pathname]);

  React.useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location, isAuthenticated]);

  const lastPath = sessionStorage.getItem('lastPath') || '/';

  const AuthenticatedRoutes = () => (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/accounts" element={<PrivateRoute element={<MyAccounts />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/transfer" element={<PrivateRoute element={<Transfer />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/pay" element={<PrivateRoute element={<Pay />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/cards" element={<PrivateRoute element={<Cards />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/apply" element={<PrivateRoute element={<Apply />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/loyaltypoints" element={<PrivateRoute element={<LoyaltyPoints />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} /> 
      <Route path="/notifications" element={<PrivateRoute element={<Notifications />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} isAuthenticated={isAuthenticated} role={role} requiredRole="user" />} />
      <Route path="*" element={<Navigate to={lastPath} replace />} />
    </Routes>
  );

  const AdminRoutes = () => (
    <Routes>
      <Route path="/admin/Dashboard" element={<PrivateRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} role={role} requiredRole="admin" />} /> 
      <Route path="/admin/loyaltypoints" element={<PrivateRoute element={<AdminLoyaltyPoints />} isAuthenticated={isAuthenticated} role={role} requiredRole="admin" />} /> 
      <Route path="*" element={<Navigate to={lastPath} replace />} />
    </Routes>
  );

  // if role = admin -> set AdminRoutes, if role = user -> set AuthenticatedRoutes, if no role -> login & register routes set
  return (
    <Routes>
      {role === 'admin' ? (
        <Route path="*" element={<AdminRoutes />} />
      ) : (
        <Route path="*" element={<AuthenticatedRoutes />} />
      )}
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
