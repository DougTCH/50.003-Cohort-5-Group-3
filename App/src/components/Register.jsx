import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import bankLogo from '../assets/FETCH_LOGOS/FETCH_LOGO_HORIZONTAL.svg'


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //register on bank app 
      const response = await axios.post('http://localhost:5001/api/register', { email, password , firstName , lastName });
      setMessage(response.data.message);

      //register on TC app 
      
      let appcode = "FETCH"; 
      const response_tc = await axios.post('http://localhost:3000/auth/register', { username: email, password, appcode});
      setMessage(response_tc.data.messsage)
      console.log("register success yay")
      
      //nagivate to login after done 
      navigate('/login');
    } catch (error) {
      console.log(response_tc)
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
