import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import bankLogo from '../assets/FETCH_LOGOS/FETCH_LOGO_HORIZONTAL.svg'
import dogLogin from '../assets/GRAPHIC_ASSETS/GRAPHIC_DOG_LOGIN.svg'


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backdoor for offline testing
      if (email === 'admin@gmail.com' && password === 'admin') {
        localStorage.setItem('token', 'admin');
        onLogin();
        navigate('/');
      } else {
        // Main login request
        try {
          const response = await axios.post('http://localhost:5001/api/login', { email, password });
          const data = response.data;
          const { user, token } = data;
          localStorage.setItem('token', token);
  
          // Set session data
          sessionStorage.setItem('firstName', user.firstName);
          sessionStorage.setItem('lastName', user.lastName);
          sessionStorage.setItem('points', user.points);
          sessionStorage.setItem('id', user.id);
          console.log('set session data', user.id);
        } catch (error) {
          console.error('Login API error:', error);
          setMessage('Login failed');
          return; // Stop further processing
        }
  
        // Transfer Connect login
        try {
          let appcode = "FETCH";
          const tcResponse = await axios.post('http://localhost:3000/auth/login', { username: email, password, appcode });
          sessionStorage.setItem('tctoken', tcResponse.data.token);
          console.log("Login on Transfer Connect works");
          console.log("tctoken is ", sessionStorage.getItem('tctoken'))
        } catch (error) {
          console.error('Transfer Connect login error:', error);
          setMessage('Transfer Connect login failed');
          return; // Stop further processing
        }
  
        onLogin();
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login process:', error);
      setMessage('Login failed');
    }
  };
  

  return (
    <div className="login-page">
        <img className="logo" src={bankLogo} alt="Fetch Banking Logo" />
        <img className="dog-login" src={dogLogin} alt="Dog Login" />
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
