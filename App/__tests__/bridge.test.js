import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bridge from '../src/components/LP_Bridge';
import { getUserData } from '../utils/userdata';
import { fetchLoyaltyPrograms, fetchUserPoints, sendTransaction, updateUserPoints } from '../utils/api';
import Modal from 'react-modal';

// Set the app element for react-modal
Modal.setAppElement(document.body);

// Mock the necessary functions
jest.mock('../utils/userdata', () => ({
  getUserData: jest.fn(),
}));

jest.mock('../utils/api', () => ({
  fetchLoyaltyPrograms: jest.fn(),
  fetchUserPoints: jest.fn(),
  sendTransaction: jest.fn(),
  updateUserPoints: jest.fn(),
}));

// Sample data for the mocks
const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  points: 1000,
  user_id: '12345',
};

const mockLoyaltyPrograms = [
  {
    pid: '1',
    name: 'Program A',
    conversion: 2,
    currency: 'USD',
    enrol_link: 'http://example.com/enrol',
    terms_c_link: 'http://example.com/terms',
    member_format: '^[0-9]{6}$',
    process_time: '2 days',
    description: 'Description A',
  },
  {
    pid: '2',
    name: 'Program B',
    conversion: 1.5,
    currency: 'EUR',
    enrol_link: 'http://example.com/enrol',
    terms_c_link: 'http://example.com/terms',
    member_format: '^[A-Za-z0-9]{8}$',
    process_time: '1 day',
    description: 'Description B',
  },
];

describe('Bridge Component', () => {
  beforeEach(() => {
    getUserData.mockReturnValue(mockUserData);
    fetchLoyaltyPrograms.mockResolvedValue(mockLoyaltyPrograms);
    fetchUserPoints.mockResolvedValue(mockUserData.points);
    sendTransaction.mockResolvedValue({ success: true });
    updateUserPoints.mockResolvedValue({ success: true });
  });

  test('displays correct available points', async () => {
    render(<Bridge options={[]} customStyles={{}} />);
    
    await waitFor(() => expect(fetchUserPoints).toHaveBeenCalledWith(mockUserData.user_id));
    expect(screen.getByText(/Available: 1000 Points/i)).toBeInTheDocument();
  });

  test('select participating merchant works', async () => {
    render(<Bridge options={[]} customStyles={{}} />);
    
    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());
    const selectInput = screen.getByRole('combobox');
    
    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    expect(screen.getByText(/Program A/i)).toBeInTheDocument();
  });

  test('more information modal works', async () => {
    render(<Bridge options={[]} customStyles={{}} />);

    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());
    const selectInput = screen.getByRole('combobox');

    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    fireEvent.click(screen.getByText(/More Information/i));

    await waitFor(() => expect(screen.getByText(/Description: Description A/i)).toBeInTheDocument());
    expect(screen.getByText(/Processing Time: 2 days/i)).toBeInTheDocument();
  });

  test('insert membership id works with regex validation', async () => {
    render(<Bridge options={[]} customStyles={{}} />);

    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());
    const selectInput = screen.getByRole('combobox');

    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    const memIdBox = screen.getByPlaceholderText(/Insert your Membership ID here/i);
    fireEvent.change(memIdBox, { target: { value: '123456' } });

    fireEvent.keyDown(memIdBox, { key: 'Enter', code: 13 });

    await waitFor(() => expect(screen.queryByText(/Invalid membership ID./i)).not.toBeInTheDocument());
  });

  test('amount you are sending works with validation', async () => {
    render(<Bridge options={[]} customStyles={{}} />);

    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());
    const selectInput = screen.getByRole('combobox');

    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    const memIdBox = screen.getByPlaceholderText(/Insert your Membership ID here/i);
    fireEvent.change(memIdBox, { target: { value: '123456' } });
    fireEvent.keyDown(memIdBox, { key: 'Enter', code: 13 });

    const amountBox = screen.getByPlaceholderText(/0/i);
    fireEvent.change(amountBox, { target: { value: '500' } });

    await waitFor(() => expect(screen.queryByText(/Invalid Amount: Please enter a valid number./i)).not.toBeInTheDocument());
    fireEvent.click(screen.getByText(/Max/i));

    expect(amountBox.value).toBe('1000');
  });

  test('transfer breakdown is showing', async () => {
    render(<Bridge options={[]} customStyles={{}} />);

    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());

    const selectInput = screen.getByRole('combobox');

    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    const memIdBox = screen.getByPlaceholderText(/Insert your Membership ID here/i);
    fireEvent.change(memIdBox, { target: { value: '123456' } });
    fireEvent.keyDown(memIdBox, { key: 'Enter', code: 13 });

    const amountBox = screen.getByPlaceholderText(/0/i);
    fireEvent.change(amountBox, { target: { value: '500' } });

    await waitFor(() => expect(screen.queryByText(/Transfer Breakdown/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Transfer Breakdown/i));

    const getByTextContent = (text) => (content, element) => {
      const hasText = (node) => node.textContent.replace(/\s+/g, ' ').trim() === text;
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    };

    expect(screen.getByText(getByTextContent('From: FETCH BANK (-500 FETCH)'))).toBeInTheDocument();
    expect(screen.getByText(getByTextContent('To: Program A (+1000 USD)'))).toBeInTheDocument();
    expect(screen.getByText(getByTextContent('Conversion Rate: 1 FETCH = 2 USD'))).toBeInTheDocument();
    expect(screen.getByText(getByTextContent('Account Balance: 500 FETCH Points'))).toBeInTheDocument();
  });

  test('confirm transaction works', async () => {
    sendTransaction.mockResolvedValue({ success: true });

    render(<Bridge options={[]} customStyles={{}} />);

    await waitFor(() => expect(fetchLoyaltyPrograms).toHaveBeenCalled());

    const selectInput = screen.getByRole('combobox');

    fireEvent.focus(selectInput);
    fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 40 });
    fireEvent.keyDown(selectInput, { key: 'Enter', code: 13 });

    const memIdBox = screen.getByPlaceholderText(/Insert your Membership ID here/i);
    fireEvent.change(memIdBox, { target: { value: '123456' } });
    fireEvent.keyDown(memIdBox, { key: 'Enter', code: 13 });

    const amountBox = screen.getByPlaceholderText(/0/i);
    fireEvent.change(amountBox, { target: { value: '500' } });

    await waitFor(() => expect(screen.queryByText(/Confirm Transaction/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Confirm Transaction/i));

    // Ensure all async calls and state updates are complete
    await waitFor(() => expect(sendTransaction).toHaveBeenCalledTimes(1));

    // Check the transaction success message
    await waitFor(() => expect(screen.getByText(/Transaction Successful!/i)).toBeInTheDocument());
  });
});