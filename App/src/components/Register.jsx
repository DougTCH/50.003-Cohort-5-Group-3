import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import bankLogo from '../assets/Banklogo.svg';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //register on bank app 
      const response = await axios.post('http://localhost:5000/api/register', { email, password });
      setMessage(response.data.message);

      //register on TC app 
      /*
      await axios.post('http://localhost:3000/api/register', { email, password}); 
      */
      //nagivate to login after done 
      navigate('/login');
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="register-page">
      <img className="logo" src={bankLogo} alt="Fetch Banking Logo" />
      <div className="container">
        
        <div className="register-box">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="register-button">Register</button>
              <p>{message}</p>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
