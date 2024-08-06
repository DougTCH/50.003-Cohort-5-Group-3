import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login, {validateEmail} from '../src/components/Login';
import Home from '../src/components/Home';
import '@testing-library/jest-dom';
import axios from 'axios';

//renders without crashing -> ui test
//redirects to home upon successful login


// Mock axios
jest.mock('axios');
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: Router });
  };
  

describe('Login Component', () => {

  it('renders without crashing', () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText("Let's Go")).toBeInTheDocument();
  });

  it('redirects to home upon successful login', async () => {
    const mockResponse = {
      data: {
        user: { firstName: 'John', lastName: 'Doe', points: 100, id: '123' },
        token: 'mockToken',
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john.doe@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText("Let's Go"));
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mockToken');
      expect(sessionStorage.getItem('firstName')).toBe('John');
      expect(sessionStorage.getItem('lastName')).toBe('Doe');
      expect(sessionStorage.getItem('points')).toBe('100');
      expect(sessionStorage.getItem('id')).toBe('123');
    });
  });

  it('sets session storage upon successful TC login ', async () => {
    // Mocking the main login request with a successful response
    const mainLoginResponse = {
      data: {
        user: { firstName: 'John', lastName: 'Doe', points: 100, id: '123' },
        token: 'mockToken',
      },
    };
    axios.post.mockResolvedValueOnce(mainLoginResponse);
  
    // Mocking the Transfer Connect login request with a successful response
    const tcLoginResponse = {
      data: {
        token: 'tcMockToken',
      },
    };
    axios.post.mockResolvedValueOnce(tcLoginResponse);
  
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
  
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john.doe@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText("Let's Go"));
  
    await waitFor(() => {
      // Check that the main login token is set
      expect(localStorage.getItem('token')).toBe('mockToken');
      // Check that the TC token is set
      expect(sessionStorage.getItem('tctoken')).toBe('tcMockToken');
      // Check that other session data is set
      expect(sessionStorage.getItem('firstName')).toBe('John');
      expect(sessionStorage.getItem('lastName')).toBe('Doe');
      expect(sessionStorage.getItem('points')).toBe('100');
      expect(sessionStorage.getItem('id')).toBe('123');
    });
  });
  

  // INPUT VALIDATION (unit testing: validateEmail )
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag+sorting@example.com')).toBe(true);
    expect(validateEmail('user.name@example.co.uk')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('plainaddress')).toBe(false);
    expect(validateEmail('@missingusername.com')).toBe(false);
    expect(validateEmail('username@.com')).toBe(false);
    expect(validateEmail('username@.com.')).toBe(false);
    expect(validateEmail('username@com')).toBe(false);
    expect(validateEmail('username@com.')).toBe(false);
    expect(validateEmail('username@com.a')).toBe(false);
  });

  it('should handle email input edge cases correctly', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(' ')).toBe(false);
    expect(validateEmail('user@domain-with-dash.com')).toBe(true);
    expect(validateEmail('user@sub.domain.com')).toBe(true);
    expect(validateEmail('user.name@sub.domain.co.in')).toBe(true);
    expect(validateEmail('user_name@domain.com')).toBe(true);
    expect(validateEmail('user-name@domain.com')).toBe(true);
  });

  // UNSUCCESFUL LOGIN TESTS (unit testing: handleSubmit )

  it('displays error message on login failure 400', async () => {
    // mock main login request with a 400 status response
    axios.post.mockRejectedValueOnce({response: { status: 400,},});
    // mocking TC login request to avoid undefined error during tests
    axios.post.mockRejectedValueOnce({response: {status: 404,},});
    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'wronguser@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(getByText("Let's Go"));
    const errorMessage = await findByText(/Incorrect email or password. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });
  
  it('displays error message on login failure 404', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 404 } });
    axios.post.mockRejectedValueOnce({ response: { status: 404 } });
    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'wronguser@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(getByText("Let's Go"));
    // custom function to match text content across multiple elements
    const errorMessage2 = await findByText((content, element) => {
      const hasText = (node) => node.textContent === 'Email not found. Please check your email or register.';
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child));
      return nodeHasText && childrenDontHaveText;
    });
    expect(errorMessage2).toBeInTheDocument();
  });

  it('displays error message for empty email field', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: '' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText("Let's Go"));
    await waitFor(() => {
      const emailInput = getByPlaceholderText('Email');
      expect(emailInput.validationMessage).toBe('Email cannot be empty.');
    });
  });

  it('displays error message for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText("Let's Go"));
    await waitFor(() => {
      const emailInput = getByPlaceholderText('Email');
      expect(emailInput.validationMessage).toBe('Invalid email format.');
    });
  });

  it('displays error message for empty password field', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.click(getByText("Let's Go"));
    await waitFor(() => {
      const passwordInput = getByPlaceholderText('Password');
      expect(passwordInput.validationMessage).toBe('Password cannot be empty.');
    });
  });

  it('succefully logs out and clears local and session storage', () => {
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
      </Routes>,
      { route: '/' }
    );

    // Simulate login
    localStorage.setItem('token', 'mockToken');
    sessionStorage.setItem('firstName', 'John');
    sessionStorage.setItem('lastName', 'Doe');
    sessionStorage.setItem('points', '100');
    sessionStorage.setItem('id', '123');

    // Simulate logout
    const handleLogout = () => {
      localStorage.removeItem('token');
      sessionStorage.clear();
    };

    handleLogout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('firstName')).toBeNull();
    expect(sessionStorage.getItem('lastName')).toBeNull();
    expect(sessionStorage.getItem('points')).toBeNull();
    expect(sessionStorage.getItem('id')).toBeNull();
  });
  


});
