import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../src/AppRoutes.jsx';
import '@testing-library/jest-dom';

describe('App', () => {
    afterEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  
    test('renders splash screen initially', () => {
      render(
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      );
      
      expect(screen.getByText(/FINANCE'S BEST FRIEND/i)).toBeInTheDocument();
    });
  
    test('redirects to login if not authenticated', async () => {
      render(
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText(/login/i)).toBeInTheDocument();
      });
    });
  
    test('redirects to home if authenticated', async () => {
        // Set the token and role in localStorage
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('role', 'user');
        // Optionally set other sessionStorage items if needed
        sessionStorage.setItem('firstName', 'John');
        sessionStorage.setItem('lastName', 'Doe');
        sessionStorage.setItem('points', '100');
        sessionStorage.setItem('id', '123');
    
        render(
          <MemoryRouter initialEntries={['/']}>
            <AppRoutes />
          </MemoryRouter>
        );
    
        // Use findByText to wait for the text to appear in the DOM
        const homeText = await screen.findByText(/welcome back to fetch!/i);
        expect(homeText).toBeInTheDocument();
      });
      
    test('logs out and clears storage', async () => {
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('role', 'user');
  
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );
  
      fireEvent.click(screen.getByText(/logout/i));
  
      await waitFor(() => {
        expect(screen.getByText(/login/i)).toBeInTheDocument();
      });
  
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });
  
    test('displays admin dashboard if role is admin', async () => {
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('role', 'admin');
  
      render(
        <MemoryRouter initialEntries={['/admin/Dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
      });
    });
  });



