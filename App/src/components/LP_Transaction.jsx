import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LP_Transaction.css';

const Transaction = () => {
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
  const[page , setPage] = useState(1);
  const limit = 4; // number of transactions per page
  const total = hardcodedTransactions.length;
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedTransactions = [...hardcodedTransactions].sort(
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
}
export default Transaction;
