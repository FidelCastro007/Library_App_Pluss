const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Member = require("../models/Member");
const Staff = require("../models/Staff");
const router = express.Router();

const FINE_RATE = 10; // Define fine rate for overdue books
// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Utility function to format the response
const formatTransactionResponse = (transaction) => {
  return {
    transactionId: transaction.transactionId,
    member: transaction.member,
    book: transaction.book,
    issuedBy: transaction.issuedBy,
    issueDate: transaction.issueDate,
    returnDate: transaction.returnDate,
    status: transaction.status,
    fineAmount: transaction.fineAmount,
  };
};

// @route GET /api/transactions
// @desc Get all transactions
router.get("/", async (req, res) => {
  const { memberId, bookId, staffId, transactionId, returnDate } = req.query;

  // Build the filter object dynamically
  const filters = {};
  if (memberId) filters.member = memberId;
  if (bookId) filters.book = bookId;
  if (staffId) filters.issuedBy = staffId;
  if (transactionId) filters._id = transactionId; // Match by ObjectId
  if (returnDate) filters.returnDate = new Date(returnDate);

  try {
    const transactions = await Transaction.find(filters)
      .populate("member", "name")
      .populate("book", "title");

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// Issue book route
router.post("/issue", async (req, res) => {
  const { memberId, bookId, staffId } = req.body;

  // Validate ObjectIds
  if (!isValidObjectId(memberId) || !isValidObjectId(bookId) || !isValidObjectId(staffId)) {
    return res.status(400).json({ message: "Invalid memberId, bookId, or staffId" });
  }

  try {
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);
    const staff = await Staff.findById(staffId);

    if (!book || !member || !staff) {
      return res.status(404).json({ message: "Book, member, or staff not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No available copies to issue" });
    }

    const defaultReturnDate = new Date();
    defaultReturnDate.setDate(defaultReturnDate.getDate() + 14);

    const transaction = new Transaction({
      member: memberId,
      book: bookId,
      issuedBy: staffId,
      issueDate: new Date(),
      returnDate: defaultReturnDate,
      status: "Issued",
      fineAmount: 0,  // Assuming fineAmount is 0 when issuing the book
    });

    await transaction.save();
    book.availableCopies -= 1;
    await book.save();

    // Format the response
    res.status(201).json({
      message: "Book issued successfully",
      transaction: formatTransactionResponse(transaction),
    });
  } catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({ message: "Error issuing book", error });
  }
});

// @desc Return a book
router.post("/return", async (req, res) => {
  const { transactionId, bookId, memberId, staffId, returnDate } = req.body;

  // Validate inputs
  if (!transactionId || !isValidObjectId(transactionId)) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }
  if (!bookId || !memberId || !staffId || !returnDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Ensure the ID is cast to ObjectId
    // const validTransactionId = mongoose.Types.ObjectId(transactionId);

    // Find the existing transaction
    const transaction = await Transaction.findOne({
      transactionId: transactionId, // Use transactionId directly as a number
      status: "Issued",
    }).populate("member book");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or already returned" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Validate return date
    const parsedReturnDate = new Date(returnDate);
    if (parsedReturnDate < transaction.issueDate) {
      return res.status(400).json({ message: "Return date cannot be earlier than issue date" });
    }

    // Update transaction
    transaction.returnDate = parsedReturnDate;
    transaction.status = "Returned";

    // Calculate fine if overdue
    const returnDeadline = new Date(transaction.issueDate);
    returnDeadline.setDate(returnDeadline.getDate() + 14); // Set to 14 days after issue date

    if (parsedReturnDate > returnDeadline) {
      const overdueDays = Math.ceil((parsedReturnDate - returnDeadline) / (1000 * 60 * 60 * 24));
      transaction.fineAmount = overdueDays * FINE_RATE;
    }

    await transaction.save();

    // Update book availability
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      transaction: formatTransactionResponse(transaction),
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Error returning book", error });
  }
});

// @route DELETE /api/transactions/:id
// @desc Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

// @route PUT /api/transactions/:id/update-fine
// @desc Update the fine amount of a transaction
router.put("/:id/update-fine", async (req, res) => {
  const { fineAmount } = req.body;

  if (fineAmount < 0) {
    return res.status(400).json({ error: "Fine amount cannot be negative" });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { fineAmount },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Fine updated successfully", transaction });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ message: "Error updating fine", error });
  }
});


module.exports = router;
