import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../../../utils/api';
import './AdminLoyaltyPoints.css';

const AdminLoyaltyPoints = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 4; // Number of transactions per page

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      const transactions = await fetchTransactions();
      setTransactions(transactions);
    };
    fetchAndSetTransactions();
  }, []);

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

  const totalPages = Math.ceil(transactions.length / limit);

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>User ID</th>
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
              <td>{transaction.user_id}</td> {/* Display User ID */}
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

export default AdminLoyaltyPoints;
