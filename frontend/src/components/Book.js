import React, { useEffect, useState } from "react";
import axios from "./axios";
import "../App.css";

function Book() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [message, setMessage] = useState(""); // Added message state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setMessage("Error fetching books.");
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "rating") {
        return b.rating - a.rating;
      } else if (sortOption === "genre") {
        return a.genre.localeCompare(b.genre);
      }
      return 0;
    });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setMessage("Book deleted successfully!");
      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage("Failed to delete the book.");
    }
  };

  const handleIssue = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/books/${id}/issue`);
      setMessage("Book issued successfully!");
      setBooks(books.map((book) => (book._id === id ? response.data.book : book)));
    } catch (error) {
      console.error("Error issuing book:", error);
      setMessage("Failed to issue the book.");
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/books/${id}/return`);
      setMessage("Book returned successfully!");
      setBooks(books.map((book) => (book._id === id ? response.data.book : book)));
    } catch (error) {
      console.error("Error returning book:", error);
      setMessage("Failed to return the book.");
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSortOption(e.target.value)}>
        <option value="">Sort By</option>
        <option value="rating">Rating</option>
        <option value="genre">Genre</option>
      </select>

      {/* Display message */}
      {message && <div className="message">{message}</div>}

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Rating: {book.rating}/5</p>
            <p>Available Copies: {book.availableCopies}</p>
            <button className="delete"  onClick={() => handleDelete(book._id)}>Delete</button>
            <button className="issue"  onClick={() => handleIssue(book._id)}>Issue</button>
            <button className="return" onClick={() => handleReturn(book._id)}>Return</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Book;
