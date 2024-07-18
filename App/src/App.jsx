import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './header';
import Home from './components/Home';
import MyAccounts from './components/MyAccounts';
import Transfer from './components/Transfer';
import Pay from './components/Pay';
import Cards from './components/Cards';
import Apply from './components/Apply';
import LoyaltyPoints from './components/LoyaltyPoints';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Header onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<MyAccounts />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/loyaltypoints" element={<LoyaltyPoints />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
