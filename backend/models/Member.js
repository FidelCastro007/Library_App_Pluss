const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, match: /^\d{10}$/, required: true },
  membershipStartDate: { type: Date, default: Date.now },
  membershipType: { type: String, enum: ["Basic", "Premium", "Elite"], required: true },
  maxBooksAllowed: {
    type: Number,
    default: function () {
      return this.membershipType === "Basic" ? 2 : this.membershipType === "Premium" ? 5 : 10;
    },
  },
  isActive: { type: Boolean, default: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  renewalDate: {
    type: Date,
    default: function () {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // Default to one year from start date
    },
  },
});

module.exports = mongoose.model("Member", memberSchema);
