import React, { useEffect, useState } from "react";
import axios from "./axios";
import "../App.css";

function Transaction() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transactions</h2>
      <table className="transaction-table animate-slide-in">
        <thead>
          <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.member.name}</td>
              <td>{txn.book.title}</td>
              <td>{txn.issueDate}</td>
              <td>{txn.returnDate}</td>
              <td className={`status-${txn.status.toLowerCase()}`}>{txn.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transaction;
