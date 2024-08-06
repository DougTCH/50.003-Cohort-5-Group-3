import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import bankLogo from '../assets/FETCH_LOGOS/FETCH_LOGO_HORIZONTAL.svg'
import dogLogin from '../assets/GRAPHIC_ASSETS/GRAPHIC_DOG_LOGIN.svg'

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // setting the error messages the input types use
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.setCustomValidity('');
      if (!email) {
        emailRef.current.setCustomValidity('Email cannot be empty.');
      } else if (!validateEmail(email)) {
        emailRef.current.setCustomValidity('Invalid email format.');
      }
    }
    if (passwordRef.current) {
      passwordRef.current.setCustomValidity('');
      if (!password) {
        passwordRef.current.setCustomValidity('Password cannot be empty.');
      }
    }
  }, [email, password]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // input validation
    if (!email || !password || !validateEmail(email)) {
      // Trigger custom validation messages
      emailRef.current.reportValidity();
      passwordRef.current.reportValidity();
      return;
    }


    try {
      // Backdoor for offline testing
      if (email === 'admin@gmail.com' && password === 'admin') {
        localStorage.setItem('token', 'admin');
        localStorage.setItem('role', 'user');
        sessionStorage.setItem('email', email);
        onLogin();
        navigate('/');
      } else if (email === 'secret@gmail.com' && password === 'secret') {
        //localStorage.setItem('token', 'admin');
        //localStorage.setItem('role', 'admin');
        //sessionStorage.setItem('email', email);
        //sessionStorage.setItem('tctoken', 'dummyToken');

          try {
            const response = await axios.post('http://localhost:5001/api/login', { email, password });
            const data = response.data;
            const { user, token } = data;
            localStorage.setItem('token', token); // prev 'admin', changed to token
            localStorage.setItem('role', 'admin');
            
            // Set session data
            sessionStorage.setItem('firstName', user.firstName);
            sessionStorage.setItem('lastName', user.lastName);
            sessionStorage.setItem('points', user.points);
            sessionStorage.setItem('id', user.id);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('lastLogin', new Date(user.lastLogin).toISOString());
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
          navigate('/admin/Dashboard');
      } else {
        // MAIN login request
        try {   // TEST: 
          const response = await axios.post('http://localhost:5001/api/login', { email, password });
          const data = response.data;
          const { user, token } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('role', 'user');
          
          // Set session data // TEST
          sessionStorage.setItem('firstName', user.firstName);
          sessionStorage.setItem('lastName', user.lastName);
          sessionStorage.setItem('points', user.points);
          sessionStorage.setItem('id', user.id);
          sessionStorage.setItem('email', email);
          console.log('set session data', user.id);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            console.error('Login API error:', error);
            setMessage('Incorrect email or password. \nPlease try again.');
          } else if (error.response && error.response.status === 404) {
            console.error('Login API error:', error);
            setMessage('Email not found. \nPlease check your email or register.');
          } else {
            console.error('Login API error:', error);
            setMessage('Login failed. Please try again later.');
          }
          return; // Stop further processing
        }
  
        // Transfer Connect login
        try {  // TEST        
          let appcode = "FETCH"; //original is FETCH , more test: NATIONAL_BANKING, KINGSMAN_BANK
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
    } catch (error) { // TEST
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
                        placeholder="Email"
                        ref={emailRef}
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        ref={passwordRef}
                        required
                    />
                    <button type="submit" className="login-button">Let's Go</button>
                    <p>{message.split('\n').map((text, index) => (
                      <React.Fragment key={index}>
                        {text}
                        <br />
                      </React.Fragment>
                    ))}</p>
                    <p>New Here? <Link to="/register">Register</Link></p>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;
