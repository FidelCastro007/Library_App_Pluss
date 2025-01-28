import React, { useState, useEffect } from "react";
import axios from "./axios";
import "../App.css";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [transactionFines, setTransactionFines] = useState({}); // State to store fine for each transaction
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(true); // Toggle between Search and Refresh
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch transactions on initial load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch all transactions from the server
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/transactions");
      setTransactions(response.data);
      setMessage("Transactions fetched successfully!");
      setError("");
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions");
      setMessage("");
    }
  };

  // Handle search logic
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchParams = {};
    if (memberId) searchParams.memberId = memberId;
    if (bookId) searchParams.bookId = bookId;
    if (staffId) searchParams.staffId = staffId;
    if (transactionId) searchParams.transactionId = transactionId;
    if (returnDate) searchParams.returnDate = returnDate;

    // Validate return date format
    if (returnDate && isNaN(new Date(returnDate).getTime())) {
      setError("Invalid return date format");
      return;
    }

    try {
      const response = await axios.get("/transactions", { params: searchParams });
      setTransactions(response.data);
      setMessage("Search results fetched successfully!");
      setError("");
      setIsSearchVisible(false); // Show Refresh button
    } catch (error) {
      console.error("Error fetching filtered transactions:", error);
      setError("Error fetching filtered transactions");
      setMessage("");
    }
  };

  // Handle refresh logic
  const handleRefresh = async () => {
    await fetchTransactions(); // Re-fetch all transactions
    setMemberId("");
    setBookId("");
    setStaffId("");
    setTransactionId("");
    setReturnDate("");
    setIsSearchVisible(true); // Show Search button
  };

  // Check if refresh button should be enabled
  const isRefreshEnabled = () => {
    return memberId || bookId || staffId || transactionId || returnDate;
  };

   
  // Handle manual fine update for each transaction
  const handleManualFineUpdate = async (txnId) => {
    const fineAmount = transactionFines[txnId];

      // Allow zero as a valid fine amount
      if (fineAmount === "" || isNaN(fineAmount) || fineAmount < 0) {
        setError("Please enter a valid fine amount.");
        return;
      }

    try {
      await axios.put(`/transactions/${txnId}/update-fine`, { fineAmount: parseFloat(fineAmount) });
      setMessage("Fine updated successfully!");
      setError("");
      fetchTransactions(); // Re-fetch the updated list of transactions
      setTransactionFines("")
    } catch (error) {
      setError("Error updating fine amount.");
      console.error("Error updating fine:", error);
    }
  };

  // Handle fine change for a specific transaction
  const handleFineChange = (txnId, value) => {
    if (value === "") {
      setTransactionFines({
        ...transactionFines,
        [txnId]: 0, // Set to zero when the input is cleared
      });
    } else {
      setTransactionFines({
        ...transactionFines,
        [txnId]: value,
      });
    }
  };
  

  return (
    <div className="transaction-container">
      <h2 className="animate__animated animate__bounce text-dark">Transactions</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <table className="transaction-table animate-slide-in">
        <thead>
          <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Fine</th>
            <th>ManualFine Teasting</th>
          </tr>
        </thead>
        <tbody>
        {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.member ? txn.member.name : "N/A"}</td>
              <td>{txn.book ? txn.book.title : "N/A"}</td>
              <td>{new Date(txn.issueDate).toLocaleDateString()}</td>
              <td>{txn.returnDate ? new Date(txn.returnDate).toLocaleDateString() : "N/A"}</td>
              <td className={`status-${txn.status.toLowerCase()}`}>{txn.status}</td>
              <td>{txn.fineAmount ? `Rs.${txn.fineAmount.toFixed(2)}` : "N/A"}</td>
              <td>
                <input
                  type="number"
                  placeholder="Manual Fine"
                  value={transactionFines[txn._id] || ""}
                  onChange={(e) => handleFineChange(txn._id, e.target.value)}
                  min="0"
                />
                <button
                  onClick={() => handleManualFineUpdate(txn._id)}
                  className="update-fine-button"
                >
                  Update Fine
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="search-form-heading">
        Transactions Search Form <i className="fa fa-search"></i>
      </h2>
      <form onSubmit={handleSearch} className="form-container">
        <input
          type="text"
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Return Date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
       {isSearchVisible ? (
        <button type="submit" className="search-button animate-button-enter"
        key="search">
          Search
        </button>
      ) : (
        <button
          type="button"
          key="refresh"
          onClick={handleRefresh}
          className={`refresh-button animate-button-enter ${isRefreshEnabled() ? "enabled" : ""}`}
          disabled={!isRefreshEnabled()}
        >
          Refresh
        </button>
      )}
      </form>
    </div>
  );
}

export default Transaction;
