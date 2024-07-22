import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../src/components/Login';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

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
});
