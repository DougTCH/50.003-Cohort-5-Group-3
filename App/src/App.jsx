import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './header';
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
import Splash from './components/Splash';
import AdminDashboard from './components/admin/Dashboard';
import AdminLoyaltyPoints from './components/admin/AdminLoyaltyPoints';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
    setTimeout(() => setShowSplash(false), 3000);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem('role'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setRole('');
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      <Main
        showSplash={showSplash}
        isAuthenticated={isAuthenticated}
        role={role}
        onSplashFinish={handleSplashFinish}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
};

const Main = ({ showSplash, isAuthenticated, role, onSplashFinish, onLogin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !showSplash && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', {replace: true});
    }
  }, [isAuthenticated, showSplash, navigate, location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location, isAuthenticated]);
  
  return (
    <>
      {showSplash && <Splash onFinish={onSplashFinish} />}
      {isAuthenticated ? (
        <>
          <Header role={role} onLogout={onLogout} />
          <Routes>
            {role === 'admin' ? (
              <Route path="*" element={<AdminRoutes isAuthenticated={isAuthenticated} role={role} />} />
            ) : (
              <Route path="*" element={<AuthenticatedRoutes isAuthenticated={isAuthenticated} role={role} />} />
            )}
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<UnauthenticatedRoutes onLogin={onLogin} />} />
        </Routes>
      )}
    </>
  );
};

const AuthenticatedRoutes = ({ isAuthenticated, role }) => {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location]);

  const lastPath = sessionStorage.getItem('lastPath') || '/';

  return (
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
      <Route path="*" element={<Navigate to={lastPath} />} />
    </Routes>
  );
};

const AdminRoutes = ({ isAuthenticated, role }) => { 
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location]);

  const lastPath = sessionStorage.getItem('lastPath') || '/admin/Dashboard';

  return (
    <Routes>
      <Route path="/admin/Dashboard" element={<PrivateRoute element={<AdminDashboard />} isAuthenticated={isAuthenticated} role={role} requiredRole="admin" />} /> 
      <Route path="/admin/loyaltypoints" element={<PrivateRoute element={<AdminLoyaltyPoints />} isAuthenticated={isAuthenticated} role={role} requiredRole="admin" />} /> 
      <Route path="*" element={<Navigate to={lastPath} />} />
    </Routes>
  );
};

const UnauthenticatedRoutes = ({ onLogin }) => (
  <Routes>
    <Route path="/login" element={<Login onLogin={onLogin} />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default App;
