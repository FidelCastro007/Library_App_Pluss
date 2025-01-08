const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");

const router = express.Router();

// @route POST /api/transactions/issue
// @desc Issue a book to a member
router.post("/issue", async (req, res) => {
  try {
    const { memberId, bookId, staffId } = req.body;

    // Validate if the book and member exist
    const book = await Book.findById(bookId);
    const member = await User.findById(memberId);
    if (!book || !member) {
      return res.status(400).json({ message: "Invalid member or book" });
    }

    // Check if the book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No available copies to issue" });
    }

    // Create new transaction record
    const transaction = new Transaction({
      member: memberId,
      book: bookId,
      issuedBy: staffId,
      issueDate: Date.now(),
      status: "Issued",
    });

    // Save transaction and update book availability
    await transaction.save();
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ message: "Book issued successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error issuing book", error });
  }
});

// @route POST /api/transactions/return
// @desc Return a book and update status
router.post("/return", async (req, res) => {
  try {
    const { transactionId, returnDate } = req.body;

    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    // Update return date and status
    transaction.returnDate = returnDate;
    transaction.status = "Returned";

    // Calculate fine if overdue
    if (new Date(returnDate) > new Date(transaction.issueDate).setDate(new Date(transaction.issueDate).getDate() + 14)) { // assuming 14 days is the return period
      const overdueDays = Math.ceil((new Date(returnDate) - new Date(transaction.issueDate)) / (1000 * 3600 * 24));
      transaction.fineAmount = overdueDays * 5; // fine per day (e.g., 5 currency units per day)
    }

    // Save transaction and update book availability
    await transaction.save();
    const book = await Book.findById(transaction.book);
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({ message: "Book returned successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
});

module.exports = router;
