import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header';
import Home from './components/Home';
import MyAccounts from './components/MyAccounts';
import Transfer from './components/Transfer';
import Pay from './components/Pay';
import Cards from './components/Cards';
import Apply from './components/Apply';
import LoyaltyPoints from './components/LoyaltyPoints';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accounts" element={<MyAccounts />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/loyaltypoints" element={<LoyaltyPoints />} />
      </Routes>
    </Router>
  );
}

export default App;
