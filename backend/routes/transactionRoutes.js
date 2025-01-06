const express = require("express");
const Transaction = require("../models/Transaction");
const Member = require("../models/Member");
const Book = require("../models/Book");

const router = express.Router();

// @route GET /api/transactions
// @desc Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("member book");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
});

// @route POST /api/transactions
// @desc Add a new transaction
router.post("/", async (req, res) => {
  const { memberId, bookId, issueDate, returnDate, status } = req.body;

  // Validate fields
  if (!memberId || !bookId || !issueDate || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book is unavailable" });
    }

    const newTransaction = new Transaction({
      member: memberId,
      book: bookId,
      issueDate,
      returnDate,
      status,
    });

    const savedTransaction = await newTransaction.save();
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
});

// @route PATCH /api/transactions/:id/return
// @desc Mark a transaction as returned
router.patch("/:id/return", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("book");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "Issued") {
      return res.status(400).json({ message: "Transaction is not in Issued status" });
    }

    const today = new Date();
    const returnDate = new Date(transaction.returnDate);
    const overdueDays = Math.max(0, Math.floor((today - returnDate) / (1000 * 60 * 60 * 24)));
    const fineAmount = overdueDays * 2;

    transaction.status = "Returned";
    transaction.fineAmount = fineAmount;
    await transaction.save();

    const book = await Book.findById(transaction.book._id);
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({ message: "Transaction marked as returned", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
});

module.exports = router;
