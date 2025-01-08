const express = require("express");
const Member = require("../models/Member");
const User = require("../models/User");

const router = express.Router();

// @route GET /api/members
// @desc Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving members", error });
  }
});

// @desc Add a new member
// @route POST /api/members
router.post("/", async (req, res) => {
    const { name, email, phoneNumber, membershipType,role} = req.body;
  
    if (!name || !email || !phoneNumber || !membershipType || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ message: "Member with this email already exists" });
      }
  
      const maxBooksAllowed =
        membershipType === "Basic" ? 2 : membershipType === "Premium" ? 5 : 10;
  
      const newMember = new Member({
        name,
        email,
        phoneNumber,
        membershipType,
        maxBooksAllowed,
        isActive,
      });
  
      const savedMember = await newMember.save();
      res.status(201).json(savedMember);
    } catch (error) {
      res.status(500).json({ message: "Error adding member", error });
    }
  });
  

// @route PUT /api/members/:id
// @desc Update a member
router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error });
  }
});

// @route DELETE /api/members/:id
// @desc Delete a member
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error });
  }
});

module.exports = router;
