const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const transactionSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ["Issued", "Returned"], default: "Issued" },
  fineAmount: { type: Number, default: 0 },
});

// Add auto-increment plugin
transactionSchema.plugin(AutoIncrement, { inc_field: "transactionId" });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
