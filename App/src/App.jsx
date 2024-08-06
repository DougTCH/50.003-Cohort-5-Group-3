// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './header';
import Splash from './components/Splash';
import AppRoutes from './AppRoutes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token(27):', localStorage.getItem('token'));
    const userRole = localStorage.getItem('role');
    console.log('Role(29):', localStorage.getItem('role'));
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
      console.log('User authenticated with role:', userRole);
    }
    setTimeout(() => setShowSplash(false), 3000);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setRole(localStorage.getItem('role'));
  };

  // attempt to clear storage on browser close
  useEffect(() => {
    const handleUnload = () => {
      localStorage.clear();
    };
  
    window.addEventListener('beforeunload', handleUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  

  const handleLogout = () => {
    localStorage.clear()
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
      {showSplash ? (
        <Splash onFinish={handleSplashFinish} />
      ) : (
        <div>
          {isAuthenticated && <Header role={role} onLogout={handleLogout} />}
          <AppRoutes
            isAuthenticated={isAuthenticated}
            role={role}
            onLogin={handleLogin}
            onLogout={handleLogout}
            showSplash={showSplash}
            handleSplashFinish={handleSplashFinish}
          />
        </div>
      )}
    </Router>
  );
};

export default App;
