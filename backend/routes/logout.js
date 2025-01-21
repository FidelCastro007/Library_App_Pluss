const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/TokenBlacklist")

// Simulate a blacklist (for example purposes)
// let blacklistedTokens = [];

// Logout Route
router.post("/logout", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Save token to blacklist
    await new BlacklistedToken({ token }).save();
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error blacklisting token:", err);
    res.status(500).json({ message: "Error processing logout" });
  }
});

// Middleware to check if token is blacklisted
const checkBlacklist = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
    }

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded; // Attach decoded user to the request
      next();
    });
  } catch (err) {
    console.error("Error checking blacklist:", err);
    res.status(500).json({ message: "Error processing request" });
  }
};


module.exports = { router, checkBlacklist };
