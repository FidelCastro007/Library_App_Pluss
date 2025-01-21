import React, { useEffect, useState } from "react";
import axios from "./axios";
import "../App.css";

function Book() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [message, setMessage] = useState(""); // Added message state
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [memberName, setMemberName] = useState('');
  const [fine, setFine] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/books");
        setBooks(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Error fetching books.");
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get("/members");
        setMembers(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        console.error("Error fetching members:", error);
        // setError("Error fetching members.");
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await axios.get("/staff");
        setStaff(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        console.error("Error fetching staff:", error);
        // setError("Error fetching staffs.");
      }
    };

    fetchBooks();
    fetchMembers();
    fetchStaff();
  }, []);

  const filteredBooks = books
  .filter((book) => book && book.title && (
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  ))
  .sort((a, b) => {
    if (sortOption === "rating") {
      return b.rating - a.rating;
    } else if (sortOption === "genre") {
      return a.genre.localeCompare(b.genre);
    }
    return 0;
  });


  
  const handleDelete = async (id) => {
    if (!selectedMemberId || !selectedStaffId) {
      setError("Please select a member and a staff member.");
      return;
    }

    try {
      await axios.delete(`/books/${id}`);
      setMessage("Book deleted successfully!");
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage("Failed to delete the book.");
    }
  };

  const handleIssue = async (id) => {
    if (!selectedMemberId || !selectedStaffId) {
      setError("Please select a member and a staff member.");
      return;
    }
  
    try {
      const response = await axios.post(`/transactions/issue`, {
        bookId: id,
        memberId: selectedMemberId,
        staffId: selectedStaffId,
      });

       // Logging the response to check if the transactionId is received correctly
    console.log("Book issued:", response.data);
  
      setMessage(`Book issued successfully! Transaction ID: ${response.data.transactionId}`);
      setBooks(
        books.map((book) =>
          book._id === id
            ? { ...book, availableCopies: book.availableCopies - 1, transactionId: response.data.transactionId } // Store the transactionId
            : book
        )
      );
    } catch (error) {
      console.error("Error issuing book:", error);
      setError("Failed to issue the book.");
    }
  };
  
  const handleReturn = async (transactionId, bookId) => {
    console.log("Handling return for Transaction ID:", transactionId);
    console.log("Selected Book ID:", bookId);
    
    if (!selectedMemberId || !selectedStaffId || !transactionId) {
      setError("Please select a member, staff member, and ensure a transaction ID is provided.");
      return;
    }
  
    try {
      const response = await axios.post(`/transactions/return`, {
        bookId: bookId,
        memberId: selectedMemberId,
        staffId: selectedStaffId,
        transactionId: transactionId,
        returnDate: new Date().toISOString(), // Assuming return happens on the current date
      });
  
      setMessage(`Book returned successfully! Transaction ID: ${response.data.transactionId}`);
      setBooks(
        books.map((book) =>
          book._id === bookId
            ? { ...book, availableCopies: book.availableCopies + 1, transactionId: null } // Clear transactionId after return
            : book
        )
      );
      setMemberName(response.data.memberName);
      setFine(response.data.fine);
    } catch (error) {
      console.error("Error returning book:", error);
      setError("Failed to return the book.");
    }
  };  
  

  // Clear message after 3 seconds
  useEffect(() => {
    if (message || error) { // Check if either message or error exists
      const timer1 = setTimeout(() => setMessage(""), 3000);
      const timer2 = setTimeout(() => setError(""), 14000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2); // Clear both timeouts when the effect is cleaned up
      };
    }
  }, [message, error]);
  

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="Book-container">
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="rating">Rating</option>
          <option value="genre">Genre</option>
        </select>
      </div>

      <div className="Book-container">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">--Select Member--</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="Book-container">
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="">--Select Staff--</option>
            {staff.map((staffMember) => (
              <option key={staffMember._id} value={staffMember._id}>
                {staffMember.name}
              </option>
            ))}
          </select>
      </div>
      {/* Display message */}
      {message && <div className="success">{message}</div>}
      {error && <p className="error">{error}</p>}

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Rating: {book.rating}/5</p>
            <p>Available Copies: {book.availableCopies}</p>
            <button className="delete" onClick={() => handleDelete(book._id)}>
              Delete
            </button>
            <button className="issue" onClick={() => handleIssue(book._id)}>
              Issue
            </button>
            {/* {book.transactionId ? (
              <button className="return" onClick={() => handleReturn(book.transactionId, book._id)}>
                Return
              </button>
            ) : (
              <p>No active transaction for this book</p>
            )} */}
            <button className="return" onClick={() => handleReturn(book.transactionId, book._id)}>
                Return
              </button>
            {memberName && (
              <div className="book-card">
                <p>Member: {memberName}</p>
                <p>Fine: ${fine}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Book;
