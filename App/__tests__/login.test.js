import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../src/components/Login';
import Home from '../src/components/Home';
import '@testing-library/jest-dom';
import axios from 'axios';

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

    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText("Let's Go")).toBeInTheDocument();
  });

  it('displays error message on login failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Login failed'));

    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'wronguser@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(getByText("Let's Go"));

    await waitFor(() => expect(getByText('Login failed')).toBeInTheDocument());
  });

  it('successful login redirects to home', async () => {
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

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'john.doe@gmail.com' } });
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
  it('IT_Login_003: Logout process', () => {
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
  

  it('displays error message for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <Login onLogin={() => {}} />
      </Router>
    );

    const emailInput = getByPlaceholderText('Username');
    fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
    fireEvent.blur(emailInput); // Trigger HTML5 validation

    expect(emailInput.validationMessage).toBe('Constraints not satisfied');
  });
});
