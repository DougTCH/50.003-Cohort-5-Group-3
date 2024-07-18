import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import bankLogo from '../assets/Banklogo.svg';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //register on bank app 
      const response = await axios.post('http://localhost:5001/api/register', { email, password , first_name , last_name });
      setMessage(response.data.message);

      //register on TC app 
      /*
      let app_code = "FETCH"; 
      await axios.post('http://localhost:3000/auth/register', { username: email, password, app_code}); 
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
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              placeholder="Last Name"
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
