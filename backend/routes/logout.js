const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Simulate a blacklist (for example purposes)
let blacklistedTokens = [];

router.post("/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
  
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Optionally add the token to the blacklist
  blacklistedTokens.push(token);

  res.json({ message: "Logged out successfully" });
});

// Middleware to check if token is blacklisted
const checkBlacklist = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token is blacklisted, please log in again" });
  }

  next();
};

module.exports = { router, checkBlacklist };
