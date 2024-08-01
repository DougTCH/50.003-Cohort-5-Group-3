import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bridge from '../src/components/LP_Bridge';
import { fetchLoyaltyPrograms, fetchUserPoints } from '../utils/api.jsx';
import Modal from 'react-modal';

// Mock the imported functions and assets
jest.mock('../utils/api.jsx', () => ({
  fetchLoyaltyPrograms: jest.fn(),
  fetchUserPoints: jest.fn(),
}));

jest.mock('../assets/UI_ASSETS/UI_BLUE_DROPDOWN_ARROW.svg', () => 'mock-arrow.png');
jest.mock('react-modal', () => ({
  ...jest.requireActual('react-modal'),
  setAppElement: () => null,
}));

beforeAll(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  Modal.setAppElement(root);
});

describe('Bridge Component', () => {
  beforeEach(() => {
    // Mock loyalty programs data
    fetchLoyaltyPrograms.mockResolvedValue([
      { pid: '1', name: 'Program 1', conversion: 1, currency: 'Points', pattern: '^[0-9]{6}$' },
      { pid: '2', name: 'Program 2', conversion: 2, currency: 'Points', pattern: '^[0-9]{6}$' },
    ]);

    // Mock user points data
    fetchUserPoints.mockResolvedValue(1000);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Bridge component with default elements', async () => {
    render(<Bridge />);

    // Check if basic elements are present
    expect(screen.getByText(/Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver/i)).toBeInTheDocument();
    expect(screen.getByText(/Available/i)).toBeInTheDocument();

    // Wait for async data to load
    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalledTimes(1));
  });

  test('handles input changes and validation for membership ID', async () => {
    render(<Bridge />);

    await waitFor(() => screen.getByText('Program 1'));

    // Select a program
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Program 1' } });
    fireEvent.click(screen.getByText('Program 1'));

    // Enter an invalid membership ID
    const memIdInput = screen.getByPlaceholderText(/Insert your Membership ID here/i);
    fireEvent.change(memIdInput, { target: { value: '123' } });
    fireEvent.keyDown(memIdInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Invalid membership ID.')).toBeInTheDocument();

    // Enter a valid membership ID
    fireEvent.change(memIdInput, { target: { value: '123456' } });
    fireEvent.keyDown(memIdInput, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText('Invalid membership ID.')).not.toBeInTheDocument();
  });

  test('alerts for invalid amount and allows valid amount input', async () => {
    window.alert = jest.fn(); // Mock alert

    render(<Bridge />);

    await waitFor(() => screen.getByText('Program 1'));

    // Select a program
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Program 1' } });
    fireEvent.click(screen.getByText('Program 1'));

    // Enter valid membership ID to proceed to amount input
    fireEvent.change(screen.getByPlaceholderText(/Insert your Membership ID here/i), {
      target: { value: '123456' },
    });
    fireEvent.keyDown(screen.getByPlaceholderText(/Insert your Membership ID here/i), {
      key: 'Enter',
      code: 'Enter',
    });

    // Enter an invalid amount
    fireEvent.change(screen.getByPlaceholderText(/0/i), { target: { value: '-10' } });
    fireEvent.keyDown(screen.getByPlaceholderText(/0/i), { key: 'Enter', code: 'Enter' });

    expect(window.alert).toHaveBeenCalledWith('Invalid Amount');

    // Ensure alert only fires once for the same invalid input
    fireEvent.keyDown(screen.getByPlaceholderText(/0/i), { key: 'Enter', code: 'Enter' });
    expect(window.alert).toHaveBeenCalledTimes(1);

    // Enter a valid amount
    fireEvent.change(screen.getByPlaceholderText(/0/i), { target: { value: '100' } });
    fireEvent.keyDown(screen.getByPlaceholderText(/0/i), { key: 'Enter', code: 'Enter' });

    expect(window.alert).toHaveBeenCalledTimes(1); // Alert should not fire again
  });

  test('handles modal interactions correctly', async () => {
    render(<Bridge />);

    await waitFor(() => screen.getByText('Program 1'));

    // Open modal
    fireEvent.click(screen.getByText(/More Information/i));
    expect(screen.getByText(/Register Here/i)).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText(/Close/i));
    expect(screen.queryByText(/Register Here/i)).not.toBeInTheDocument();
  });
});
