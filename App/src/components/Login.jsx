import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import bankLogo from '../assets/Banklogo.svg'


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //backdoor for offline testing
      if (email === 'admin@gmail.com' && password === 'admin') {
        localStorage.setItem('token', 'admin');
        onLogin();
        navigate('/');
      } else {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token);

        //login on transfer connect
        /*const tcResponse = await axios.post('http://localhost:3000/auth/login', { email, password});
        localStorage.setItem('tctoken'. tcResponse.data.token );
        */
        onLogin();
        navigate('/');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="login-page">
    <img className="logo" src={bankLogo} alt="Fetch Banking Logo" />

      <div className="container">
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            <label>Login</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="login-button">Let's Go</button>
            <p>{message}</p>
            <p>New Here? <Link to="/register">Register</Link></p>
            
          </form>
        
        </div>
      </div>
    </div>
  );
};

export default Login;
