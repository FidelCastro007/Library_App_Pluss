const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const transactionSchema = new mongoose.Schema({
  member: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Member", 
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book", 
    required: true 
  },
  issuedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Staff", 
    required: true 
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  returnDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ["Issued", "Returned"], 
    default: "Issued" 
  },
  fineAmount: { 
    type: Number, 
    default: 0 
  },
  // transactionId: { 
  //   type: Number, 
  //   required: true 
  // },
});

// Add auto-increment plugin for transactionId
transactionSchema.plugin(AutoIncrement, { 
  inc_field: "transactionId", 
  // start_seq: 1000  // Optional: start the transactionId from a specific number
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
