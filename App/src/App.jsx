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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setTimeout(() => setShowSplash(false), 3000);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setIsAuthenticated(false);
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
        onSplashFinish={handleSplashFinish}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
};

const Main = ({ showSplash, isAuthenticated, onSplashFinish, onLogin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !showSplash) {
      navigate('/login');
    }
  }, [isAuthenticated, showSplash, navigate]);

  useEffect(() => {
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location]);

  return (
    <>
      {showSplash && <Splash onFinish={onSplashFinish} />}
      {isAuthenticated ? (
        <>
          <Header onLogout={onLogout} />
          <AuthenticatedRoutes />
        </>
      ) : (
        <UnauthenticatedRoutes onLogin={onLogin} />
      )}
    </>
  );
};

const AuthenticatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location]);

  const lastPath = sessionStorage.getItem('lastPath') || '/';

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/accounts" element={<MyAccounts />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/pay" element={<Pay />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/loyaltypoints" element={<LoyaltyPoints />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
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
