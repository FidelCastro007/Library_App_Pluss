import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function Home() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success message
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/books/${id}`)
        .then((response) => {
          const { title, author, genre, rating, isbn, publicationYear, availableCopies, isFeatured } = response.data;
          setTitle(title);
          setAuthor(author);
          setGenre(genre);
          setRating(rating);
          setIsbn(isbn);
          setPublicationYear(publicationYear);
          setAvailableCopies(availableCopies);
          setIsFeatured(isFeatured);
        })
        .catch((err) => {
          setError("Error fetching book details");
          console.error(err);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }

    const bookData = {
      title,
      author,
      genre,
      rating: Number(rating),
      isbn,
      publicationYear: Number(publicationYear),
      availableCopies: Number(availableCopies),
      isFeatured,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/books/${id}`, bookData);
        setMessage("Book updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/books/", bookData);
        setMessage("Book added successfully!");
      }
      setError("");
      navigate("/books");
    } catch (err) {
      setError("Error saving book");
      setMessage(""); // Clear success message on error
      console.error(err);
    }
  };

  return (
    <div className="book-form">
      <h1>Welcome to the Library App</h1>
      <h2>{id ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>} {/* Success message */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre ex:Fiction, Non-Fiction, Sci-Fi, Biography"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Publication Year"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Available Copies"
          value={availableCopies}
          onChange={(e) => setAvailableCopies(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured Book
        </label>
        <button class="book-btn" type="submit">{id ? "Save" : "Add"}</button>
      </form>
    </div>
  );
}

export default Home;
