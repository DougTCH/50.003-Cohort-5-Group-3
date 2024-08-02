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
  { transaction_date: '22/07/2024', t_id: '4903481991', loyalty_pid: 'Fast Fruits', amount: '-900.00', status: 'Pending' },
  { transaction_date: '14/07/2024', t_id: '3594090220', loyalty_pid: 'Royal Air', amount: '-0.10', status: 'Pending' },
  { transaction_date: '12/07/2024', t_id: '8394875220', loyalty_pid: 'noo', amount: '-10.00', status: 'Finalised' },
  { transaction_date: '10/01/2024', t_id: '9040890202', loyalty_pid: 'Royal Air', amount: '-99.00', status: 'Finalised' },
  { transaction_date: '09/01/2024', t_id: '4903481992', loyalty_pid: 'Royal Air', amount: '-50.00', status: 'Pending' },
  { transaction_date: '08/01/2024', t_id: '3594090221', loyalty_pid: 'Royal Air', amount: '-25.10', status: 'Pending' },
  { transaction_date: '07/01/2023', t_id: '8394875221', loyalty_pid: 'Yes', amount: '-30.00', status: 'Finalised' },
  { transaction_date: '06/01/2024', t_id: '9040890203', loyalty_pid: 'Royal Air', amount: '-75.00', status: 'Finalised' },
  // Add more transactions as needed
];


const fetchLoyaltyPrograms = async () => {
  try {
    const response = await axios.get('http://localhost:3000/info/get-loyalty-programs',
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('tctoken')}` } //send authentication to TC 
        }, 
    )
    console.log(response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching loyalty programs, using fallback data: ', error);
    return fallbackLoyaltyPrograms;
  }
};

const fetchTransactions = async (user_id) => {
  try {
    // Check if user_id is valid
    if (!user_id || typeof user_id !== 'string') {
      throw new Error("user_id is required and must be a string");
    }

    // Fetch transactions via user_id 
    const response = await axios.get('http://localhost:3000/transact/obtain_record/byUserId', {
      params: { user_id }, // Ensure user_id is sent as a parameter
      headers: { Authorization: `Bearer ${sessionStorage.getItem('tctoken')}` }
    });


    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message === 'No records found') {
      return [];}
   
    console.log(user_id);
    console.error('Error in fetchTransaction:', error.response ? error.response.data : error.message);
    return [];
  }
};


const sendTransaction = async (
  app_id,
  loyalty_pid,
  user_id,
  member_id,
  member_first,
  member_last,
  transaction_date,
  ref_num,
  amount,
  additional_info,
 
) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/transact/add_record', 
      {
        app_id,
        loyalty_pid,
        user_id,
        member_id,
        member_first,
        member_last,
        transaction_date,
        ref_num,
        amount,
        additional_info,
      },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('tctoken')}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in sendTransaction:', error.response ? error.response.data : error.message);
    throw error; // rethrow the error after logging it
  }
};

const API_URL = 'http://localhost:5001/api';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { user } = response.data;
    sessionStorage.setItem('id', user.id);
    sessionStorage.setItem('firstName', user.firstName);
    sessionStorage.setItem('lastName', user.lastName);
    sessionStorage.setItem('points', user.points);
    sessionStorage.setItem('mobileNumber', user.mobileNumber);
    sessionStorage.setItem('tier', user.tier);
    sessionStorage.setItem('membershipIDs', JSON.stringify(user.membershipIDs));
    sessionStorage.setItem('vouchers', JSON.stringify(user.vouchers));
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const register = async (email, password, firstName, lastName) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, firstName, lastName });
    const { user } = response.data;
    sessionStorage.setItem('id', user.id);
    sessionStorage.setItem('firstName', user.firstName);
    sessionStorage.setItem('lastName', user.lastName);
    sessionStorage.setItem('points', user.points);
    sessionStorage.setItem('mobileNumber', user.mobileNumber);
    sessionStorage.setItem('tier', user.tier);
    sessionStorage.setItem('membershipIDs', JSON.stringify(user.membershipIDs));
    sessionStorage.setItem('vouchers', JSON.stringify(user.vouchers));
    return response;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

const fetchUserPoints = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/points/${userId}`);
    return response.data.points;
  } catch (error) {
    console.error('Error fetching user points:', error);
    throw error; // rethrow error so caller can handle it
  }
};

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('tctoken')}` }
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

const updateUserPoints = async (userId, newPoints) => {
  try {
    const response = await axios.post(`${API_URL}/update_points/${userId}`, { newPoints }, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('tctoken')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating points:', error.response?.data || error.message);
    throw error;
  }
};

export { login, register, fetchTransactions, fetchLoyaltyPrograms, fallbackLoyaltyPrograms, fetchUserPoints, sendTransaction, updateUserPoints, fetchAllUsers };

