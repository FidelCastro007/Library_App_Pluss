const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");

const router = express.Router();
const FINE_RATE = 5; // Configurable fine per day

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @route GET /api/transactions
// @desc Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("member", "name")
      .populate("book", "title");
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// @route POST /api/transactions/issue
// @desc Issue a book to a member
router.post("/issue", async (req, res) => {
  const { memberId, bookId, staffId } = req.body;

  // Validate ObjectIds
  if (!isValidObjectId(memberId) || !isValidObjectId(bookId) || !isValidObjectId(staffId)) {
    return res.status(400).json({ message: "Invalid memberId, bookId, or staffId" });
  }

  try {
    const book = await Book.findById(bookId);
    const member = await User.findById(memberId);

    // Validate book and member existence
    if (!book || !member) {
      return res.status(404).json({ message: "Book or Member not found" });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No available copies to issue" });
    }

    // Create transaction
    const transaction = new Transaction({
      member: memberId,
      book: bookId,
      issuedBy: staffId,
      issueDate: new Date(),
      status: "Issued",
    });

    // Save transaction and update book availability
    await transaction.save();
    book.availableCopies -= 1;
    await book.save();

    console.log(`Book issued: Transaction ID - ${transaction._id}`);
    res.status(201).json({ message: "Book issued successfully", transaction });
  } catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({ message: "Error issuing book", error });
  }
});

// @route POST /api/transactions/return
// @desc Return a book and update status
router.post("/return", async (req, res) => {
  const { transactionId, returnDate } = req.body;

  // Validate ObjectId and returnDate
  if (!isValidObjectId(transactionId)) {
    return res.status(400).json({ message: "Invalid transactionId" });
  }
  if (!returnDate || isNaN(new Date(returnDate).getTime())) {
    return res.status(400).json({ message: "Invalid returnDate" });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const book = await Book.findById(transaction.book);
    if (!book) {
      return res.status(404).json({ message: "Book not found for this transaction" });
    }

    // Validate return date
    if (new Date(returnDate) < new Date(transaction.issueDate)) {
      return res.status(400).json({ message: "Return date cannot be earlier than issue date" });
    }

    // Update return date and status
    transaction.returnDate = new Date(returnDate);
    transaction.status = "Returned";

    // Fine calculation
    const returnDeadline = new Date(transaction.issueDate);
    returnDeadline.setDate(returnDeadline.getDate() + 14); // 14-day return period
    if (new Date(returnDate) > returnDeadline) {
      const overdueDays = Math.ceil((new Date(returnDate) - returnDeadline) / (1000 * 60 * 60 * 24));
      transaction.fineAmount = overdueDays * FINE_RATE;
    }

    // Save transaction and update book availability
    await transaction.save();
    book.availableCopies += 1;
    await book.save();

    console.log(`Book returned: Transaction ID - ${transaction._id}`);
    res.status(200).json({ message: "Book returned successfully", transaction });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Error returning book", error });
  }
});

module.exports = router;
