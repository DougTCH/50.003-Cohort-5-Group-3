import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../../utils/api';
import './LP_Transaction.css';
import { getUserData } from '../../utils/userdata';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
  });

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      if (userData.user_id) {
        console.log("user id is ", userData.user_id);
        const transactions = await fetchTransactions(userData.user_id);
        console.log(transactions);
        setTransactions(transactions);
      }
    };
    fetchAndSetTransactions();
  }, [userData.user_id]);

  const [page, setPage] = useState(1);
  const limit = 4; // number of transactions per page
  const total = transactions.length;

  const formatDate = (dateStr) => {
    if (dateStr && dateStr.length === 8) {
      const day = dateStr.slice(0, 2);
      const month = dateStr.slice(2, 4);
      const year = dateStr.slice(4);
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
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
              <td>{formatDate(transaction.transaction_date)}</td>
              <td>{transaction.t_id}</td>
              <td>{transaction.loyalty_pid}</td>
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
