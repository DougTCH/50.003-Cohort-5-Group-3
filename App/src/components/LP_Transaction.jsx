import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../../utils/api'; // Import the fetchTransactions function
import './LP_Transaction.css';
import { getUserData } from '../../utils/userdata';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
  })
  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  // Call the API to get the transactions
  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      const transactions = await fetchTransactions(userData.user_id);
      setTransactions(transactions);
    };
    fetchAndSetTransactions();
  }, []);

  const [page, setPage] = useState(1);
  const limit = 4; // number of transactions per page
  const total = transactions.length;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Receiver</th>
            <th>Transfer Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.transactionId}</td>
              <td>{transaction.receiver}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={page === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Transaction;
