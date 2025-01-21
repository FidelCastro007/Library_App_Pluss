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
        console.log(response.data); // Log the response to verify data
        setTransactions(response.data);
        setMessage("Transactions fetched successfully!");
        setError(""); // Reset error message if successful
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Error fetching transactions");
        setMessage(""); // Reset success message if an error occurs
      }
    };
    fetchTransactions();
  }, []);

  // Handle form submission to filter transactions based on memberId, bookId, etc.
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchParams = {};

    if (memberId) searchParams.memberId = memberId;
    if (bookId) searchParams.bookId = bookId;
    if (staffId) searchParams.staffId = staffId;
    if (transactionId) searchParams.transactionId = transactionId;
    if (returnDate) searchParams.returnDate = returnDate;

    try {
      const response = await axios.get("/transactions", { params: searchParams });
      setTransactions(response.data);
      setMessage("Search results fetched successfully!");
      setError(""); // Reset error message if successful
    } catch (error) {
      console.error("Error fetching filtered transactions:", error);
      setError("Error fetching filtered transactions");
      setMessage(""); // Reset success message if an error occurs
    }
  };

  return (
    <div className="transaction-container">
      <h2 className="animate__animated animate__bounce text-dark">Transactions</h2>
      {error && <p className="error">{error}</p>}
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
              {/* Safely access member and book properties */}
              <td>{txn.member ? txn.member.name : "N/A"}</td>
              <td>{txn.book ? txn.book.title : "N/A"}</td>
              <td>{new Date(txn.issueDate).toLocaleDateString()}</td>
              <td>{txn.returnDate ? new Date(txn.returnDate).toLocaleDateString() : "N/A"}</td>
              <td className={`status-${txn.status.toLowerCase()}`}>{txn.status}</td>
              <td>{txn.fineAmount ? `$${txn.fineAmount.toFixed(2)}` : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="search-form-heading">
       Transactions Search Form <i className="fa fa-search"></i>
      </h2>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="form-container">
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
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Return Date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Transaction;
