const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// @route GET /api/books
// @desc Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

// @route POST /api/books
// @desc Add a new book
router.post("/", async (req, res) => {
    const { title, author, genre, rating, isbn, publicationYear, availableCopies, isFeatured } = req.body;
  
    console.log(req.body); // Log the incoming request body for debugging
  
    // Validate fields
    if (!title || !author || !genre || !publicationYear || !availableCopies || !isbn || !rating || !isFeatured) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: "ISBN number must be unique" });
      }
  
      if (publicationYear < 1900 || publicationYear > new Date().getFullYear()) {
        return res.status(400).json({ message: "Invalid publication year" });
      }
  
      const newBook = new Book({
        title,
        author,
        genre,
        publicationYear,
        availableCopies,
        isbn,
        rating,
        // Convert isFeatured to boolean, default to false if not provided
        isFeatured: isFeatured === 'true' || isFeatured === true
      });
  
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(500).json({ message: "Error adding book", error });
    }
  });
  
  
// @route PUT /api/books/:id
// @desc Update a book
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

// @route DELETE /api/books/:id
// @desc Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

// @route PATCH /api/books/:id/issue
// @desc Issue a book
router.patch("/:id/issue", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No available copies to issue" });
    }

    book.availableCopies -= 1;
    await book.save();
    res.status(200).json({ message: "Book issued successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error issuing book", error });
  }
});

// @route PATCH /api/books/:id/return
// @desc Return a book
router.patch("/:id/return", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.availableCopies += 1;
    await book.save();
    res.status(200).json({ message: "Book returned successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
});

module.exports = router;
