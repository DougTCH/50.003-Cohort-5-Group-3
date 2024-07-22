// api.jsx
import axios from 'axios';



const fallbackLoyaltyPrograms = [
  {
    "pid": "BEST_MOVERS",
    "name": "Best Movers",
    "currency": "MOVE",
    "process_time": "Instant",
    "description": "Moving, shipping, and heavy transports all in one app!",
    "enrol_link": "https://example.com/enrol/BEST_MOVERS",
    "terms_c_link": "https://example.com/terms/BEST_MOVERS",
    "conversion": 5,
    "pattern": "^[A-Z]{4}[0-9]{6}[A-Z]$"
  },
  {
    "pid": "CITY_GREEN",
    "name": "City Green",
    "currency": "CITY",
    "process_time": "Instant",
    "description": "City green, it's easy to go green!",
    "enrol_link": "https://example.com/enrol/CITY_GREEN",
    "terms_c_link": "https://example.com/terms/CITY_GREEN",
    "conversion": 50,
    "pattern": "^[A-Z]{4}[0-9]{4}$"
  },
  {
    "pid": "FAST_FRUITS",
    "name": "Fast Fruits",
    "currency": "FAST",
    "process_time": "Instant",
    "description": "Singapore's number one choice for grocery shopping",
    "enrol_link": "https://example.com/enrol/FAST_FRUITS",
    "terms_c_link": "https://example.com/terms/FAST_FRUITS",
    "conversion": 22,
    "pattern": "^[A-Z]{2}[0-9]{5}$"
  },
  // Add more loyalty programs as needed
];

const hardcodedTransactions = [
  { date: '14/07/2024', transactionId: '4903481991', receiver: 'Royal Air', amount: '-100.00', status: 'Pending' },
  { date: '14/07/2024', transactionId: '3594090220', receiver: 'Royal Air', amount: '-0.10', status: 'Pending' },
  { date: '12/07/2024', transactionId: '8394875220', receiver: 'noo', amount: '-10.00', status: 'Finalised' },
  { date: '10/01/2024', transactionId: '9040890202', receiver: 'Royal Air', amount: '-99.00', status: 'Finalised' },
  { date: '09/01/2024', transactionId: '4903481992', receiver: 'Royal Air', amount: '-50.00', status: 'Pending' },
  { date: '08/01/2024', transactionId: '3594090221', receiver: 'Royal Air', amount: '-25.10', status: 'Pending' },
  { date: '07/01/2023', transactionId: '8394875221', receiver: 'Yes', amount: '-30.00', status: 'Finalised' },
  { date: '06/01/2024', transactionId: '9040890203', receiver: 'Royal Air', amount: '-75.00', status: 'Finalised' },
  // Add more transactions as needed
];

const fetchLoyaltyPrograms = async () => {
  try {
    const response = await axios.get('https://api.example.com/loyalty-programs'); // Add the correct API URL here
    return response.data;
  } catch (error) {
    console.error('Error fetching loyalty programs, using fallback data: ', error);
    return fallbackLoyaltyPrograms;
  }
};

const fetchTransactions = async (user_id) => {
  try{
    //fetch transactions via user_id  
    const response = await axios.get('https://api.example.com/transactions', //same add correct api url here
      {params: user_id}
    );
    return response.data;
  }
    catch(error){
    console.error('Error fetching transactions, using hardcoded data: ', error);
    return hardcodedTransactions;
  }
};

const API_URL = 'http://localhost:5001/api';

const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const register = async (email, password, firstName, lastName) => {
  return axios.post(`${API_URL}/register`, { email, password, firstName, lastName });
};



export { login, register, fetchTransactions, fetchLoyaltyPrograms, fallbackLoyaltyPrograms };

