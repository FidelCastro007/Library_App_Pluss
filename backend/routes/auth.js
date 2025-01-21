const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Member = require("../models/Member"); // Import Member model
const Staff = require("../models/Staff");
const { checkBlacklist } = require("./logout");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber, role, membershipType,staffRole } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    if (role === "Member" && !membershipType) {
      return res.status(400).json({ error: "Membership type is required for Members." });
    }

    if (role === "Staff" && !staffRole) {
      return res.status(400).json({ error: "Staff role is required for Staff." });
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
      membershipType: role === "Member" ? membershipType : undefined,
      staffRole: role === "Staff" ? staffRole : undefined, // Ensure staffRole is saved if provided
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

// Token Validation Route
router.get("/validate", checkBlacklist, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
