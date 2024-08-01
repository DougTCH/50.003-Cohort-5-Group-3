import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Transaction from '../src/components/LP_Transaction';
import { fetchTransactions } from '../utils/api';
import { getUserData } from '../utils/userdata';
import '@testing-library/jest-dom';

// Mock the fetchTransactions function
jest.mock('../utils/api', () => ({
  fetchTransactions: jest.fn(),
}));

jest.mock('../utils/userdata', () => ({
  getUserData: jest.fn(),
}));

const transactions = [
  { date: '14/07/2024', transactionId: '4903481991', receiver: 'Royal Air', amount: '-100.00', status: 'Pending' },
  { date: '12/07/2024', transactionId: '8394875220', receiver: 'noo', amount: '-10.00', status: 'Finalised' },
  { date: '10/01/2024', transactionId: '9040890202', receiver: 'Royal Air', amount: '-99.00', status: 'Finalised' },
  { date: '09/01/2024', transactionId: '4903481992', receiver: 'Royal Air', amount: '-50.00', status: 'Pending' },
  { date: '08/01/2024', transactionId: '3594090221', receiver: 'Royal Air', amount: '-25.10', status: 'Pending' },
];

describe('Transaction Component', () => {
  beforeEach(() => {
    fetchTransactions.mockResolvedValue(transactions);
    getUserData.mockReturnValue({ firstName: 'John', lastName: 'Doe', points: 100, user_id: '123' });
  });

  it('renders without crashing', async () => {
    render(<Transaction />);
    await waitFor(() => expect(screen.getByText('Transaction ID')).toBeInTheDocument());
  });

  it('sorts transactions by date', async () => {
    render(<Transaction />);
    await waitFor(() => {
      const transactionRows = screen.getAllByRole('row');
      const firstRow = transactionRows[1]; // first row after header
      expect(firstRow).toHaveTextContent('-100.00Pending');
    });
  });

  it('handles pagination correctly', async () => {
    render(<Transaction />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('2'));
    await waitFor(() => {
      const transactionRows = screen.getAllByRole('row');
      const firstRow = transactionRows[1]; // first row after header
      expect(firstRow).toHaveTextContent('-25.10Pending');
    });
  });
});
