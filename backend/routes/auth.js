const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Member = require("../models/Member"); // Import Member model
const Staff = require("../models/Staff");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber, role, membershipType,staffRole } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !role || !membershipType || !staffRole) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      membershipType,
      staffRole, // Ensure staffRole is saved if provided
    });

    // Save User
    await newUser.save();

     // Additional logic for specific roles
    if (role === "Member") {
      const newMember = new Member({
        name,
        email,
        phoneNumber,
        membershipType: membershipType || "Basic",
      });
      await newMember.save();
    } else if (role === "Staff") {
      const newStaff = new Staff({
        name,
        email,
        staffRole: staffRole ||"Librarian", // Default to Librarian for staff (can adjust dynamically)
        phoneNumber,
      });
      await newStaff.save();
    }

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Error registering user or member", details: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
    
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in", details: err.message });
  }
});

// Get All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving members.", details: err.message });
  }
});

module.exports = router;
