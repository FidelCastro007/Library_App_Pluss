const express = require("express");
const Book = require("../models/Book");
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction model

const router = express.Router();

// @route GET /api/books
// @desc Get all books
//@route GET /api/books
// @desc Get all books with transaction details
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();

    const booksWithTransactions = await Promise.all(
      books.map(async (book) => {
        const transaction = await Transaction.findOne({ book: book._id }).sort({ createdAt: -1 }); // Fixed query
        // console.log("Book:", book.title, "Transaction:", transaction); // Debugging
        return {
          ...book._doc,
          transactionId: transaction ? transaction.transactionId : null,
          transactionDetails: transaction || null, // Include full transaction details if needed
        };
      })
    );

    res.status(200).json(booksWithTransactions);
  } catch (error) {
    console.error("Error retrieving books with transactions:", error);
    res.status(500).json({ message: "Error retrieving books with transactions", error });
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

module.exports = router;
