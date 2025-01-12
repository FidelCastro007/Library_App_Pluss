const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, match: /^\d{10}$/, required: true },
  role: { type: String, enum: ["Member", "Staff"], required: true },
  membershipType: { type: String, enum: ["Basic", "Premium", "Elite"], required: function () { return this.role === "Member"; },
},
  staffRole: { type: String, enum: ["Librarian", "Assistant"], required: function () { return this.role === "Staff"; },
 },
//  borrowedBooks: [
//   {
//     bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
//     title: String,
//     issuedDate: Date,
//     returnDate: Date,
//   },
// ],
});

module.exports = mongoose.model("User", userSchema);
