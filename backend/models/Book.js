const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, enum: ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Mystery", "Fantasy"], required: true },
  publicationYear: { type: Number, min: 1900, max: new Date().getFullYear() },
  availableCopies: { type: Number, min: 0, required: true },
  isbn: { type: String, unique: true, required: true },
  rating: { type: Number, min: 1, max: 5 },
  isFeatured: { type: Boolean, default: false },
});

module.exports = mongoose.model("Book", bookSchema);
