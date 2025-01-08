const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, match: /^\d{10}$/, required: true },
  role: { type: String, enum: ["Member", "Staff"], required: true },
  membershipType: { type: String, enum: ["Basic", "Premium", "Elite"], required: true },
  staffRole: { type: String, enum: ["Librarian", "Assistant"], required: true },
});

module.exports = mongoose.model("User", userSchema);
