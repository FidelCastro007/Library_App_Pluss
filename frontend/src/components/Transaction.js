import React, { useState, useEffect } from "react";
import axios from "./axios";
import "../App.css";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success message

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/transactions");
        setTransactions(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Error fetching transactions", error);
        setMessage("");
      }
    };
    fetchTransactions();
  }, []);

  // Handle issue book
  const handleIssue = async () => {
    try {
      const response = await axios.post("/transactions/issue", {
        memberId,
        bookId,
        staffId,
      });
      setMessage(response.data.message);
      setTransactions((prev) => [response.data.transaction, ...prev]);
    } catch (error) {
      setError(error.response?.data?.message || "Error issuing book");
    }
  };

  // Handle return book
  const handleReturn = async () => {
    try {
      const response = await axios.post("/transactions/return", {
        transactionId,
        returnDate,
      });
      setMessage(response.data.message);
      const updatedTransaction = response.data.transaction;
      setTransactions((prev) =>
        prev.map((txn) =>
          txn._id === updatedTransaction._id ? updatedTransaction : txn
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transactions</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>} {/* Success message */}
      {/* Issue Book Form */}
      <div className="form-container">
        <h3>Issue a Book</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          />
          <button onClick={handleIssue}>Issue</button>
        </form>
      </div>

      {/* Return Book Form */}
      <div className="form-container">
        <h3>Return a Book</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          <button onClick={handleReturn}>Return</button>
        </form>
      </div>

      {/* Display Message */}
      {message && <p className="success">{message}</p>} {/* Success message */}

      {/* Transactions Table */}
      <table className="transaction-table animate-slide-in">
        <thead>
          <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.member.name}</td>
              <td>{txn.book.title}</td>
              <td>{new Date(txn.issueDate).toLocaleDateString()}</td>
              <td>{txn.returnDate ? new Date(txn.returnDate).toLocaleDateString() : "N/A"}</td>
              <td className={`status-${txn.status.toLowerCase()}`}>{txn.status}</td>
              <td>{txn.fineAmount ? `$${txn.fineAmount.toFixed(2)}` : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transaction;
