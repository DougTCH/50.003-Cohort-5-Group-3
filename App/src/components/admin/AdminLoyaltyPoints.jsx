import React, { useState, useEffect } from 'react';
import { fetchAllPendingTransactions, fetchAllProcessedTransactions, fetchAllDeleteRequests, deleteTransactionById } from '../../../utils/api'; // Import the delete function
import './AdminLoyaltyPoints.css';

const AdminLoyaltyPoints = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [processedTransactions, setProcessedTransactions] = useState([]);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [newPending, setNewPending] = useState(false);
  const [newProcessed, setNewProcessed] = useState(false);
  const [newDeleteRequests, setNewDeleteRequests] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      const pending = await fetchAllPendingTransactions();
      const processed = await fetchAllProcessedTransactions();
      const deleteReqs = await fetchAllDeleteRequests();
      setPendingTransactions(pending);
      setProcessedTransactions(processed);
      setDeleteRequests(deleteReqs);
      setTransactions([...pending, ...processed, ...deleteReqs]);
    };
    fetchAndSetTransactions();
  }, []);

  useEffect(() => {
    const checkForNewTransactions = () => {
      const lastLogin = new Date(sessionStorage.getItem('lastLogin'));

      const hasNewPending = pendingTransactions.some(transaction => 
        new Date(transaction.transaction_date) > lastLogin);
      const hasNewProcessed = processedTransactions.some(transaction => 
        new Date(transaction.transaction_date) > lastLogin);
      const hasNewDeleteRequests = deleteRequests.some(request =>
        new Date(request.request_date) > lastLogin);

      setNewPending(hasNewPending);
      setNewProcessed(hasNewProcessed);
      setNewDeleteRequests(hasNewDeleteRequests);
    };

    if (sessionStorage.getItem('lastLogin')) {
      checkForNewTransactions();
    }
  }, [pendingTransactions, processedTransactions, deleteRequests]);

  const formatDate = (dateStr) => {
    if (dateStr && dateStr.length === 8) {
      const day = dateStr.slice(0, 2);
      const month = dateStr.slice(2, 4);
      const year = dateStr.slice(4);
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const handleDeleteTransaction = async (t_id) => {
    try {
      await deleteTransactionById(t_id);
      setTransactions(transactions.filter(transaction => transaction.t_id !== t_id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Pending') return transaction.status === 'Pending';
    if (selectedFilter === 'Processed') return transaction.status === 'Processed';
    if (selectedFilter === 'DeleteRequests') return transaction.status === 'DeleteRequest';
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(filteredTransactions.length / limit);

  return (
    <div className="transaction-table-container">
      <div className="filter-container">
        <button
          className={selectedFilter === 'All' ? 'active' : ''}
          onClick={() => setSelectedFilter('All')}
        >
          All
        </button>
        <button
          className={selectedFilter === 'Pending' ? 'active' : ''}
          onClick={() => setSelectedFilter('Pending')}
        >
          Pending {newPending && <span className="red-dot"></span>}
        </button>
        <button
          className={selectedFilter === 'Processed' ? 'active' : ''}
          onClick={() => setSelectedFilter('Processed')}
        >
          Processed {newProcessed && <span className="red-dot"></span>}
        </button>
        <button
          className={selectedFilter === 'DeleteRequests' ? 'active' : ''}
          onClick={() => setSelectedFilter('DeleteRequests')}
        >
          Delete Requests {newDeleteRequests && <span className="red-dot"></span>}
        </button>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>User ID</th>
            <th>Receiver</th>
            <th>Transfer Amount</th>
            <th>Status</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{formatDate(transaction.transaction_date)}</td>
              <td>{transaction.t_id}</td>
              <td>{transaction.user_id}</td>
              <td>{transaction.loyalty_pid}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.status}</td>
              <td>
                {transaction.status === 'DeleteRequest' && (
                  <button onClick={() => handleDeleteTransaction(transaction.t_id)}>
                    Delete
                  </button>
                )}
              </td>
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
