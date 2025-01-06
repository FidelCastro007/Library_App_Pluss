const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["Librarian", "Assistant"], required: true },
  phoneNumber: { type: String, match: /^\d{10}$/, required: true },
});

module.exports = mongoose.model("Staff", staffSchema);
