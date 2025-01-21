const mongoose = require("mongoose");

// TokenBlacklist Schema
const BlacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token auto-deletes after 1 hour
});

module.exports = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);
