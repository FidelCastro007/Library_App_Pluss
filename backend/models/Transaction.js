const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Staff ID
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ["Issued", "Returned", "Overdue"], default: "Issued" },
  fineAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Transaction", transactionSchema);
