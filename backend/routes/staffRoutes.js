const express = require("express");
const Staff = require("../models/Staff");

const router = express.Router();

// @route GET /api/staff
// @desc Get all staff members
router.get("/", async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving staff members", error });
  }
});

// @route POST /api/staff
// @desc Add a new staff member
router.post("/", async (req, res) => {
  const { name, email, staffRole, phoneNumber } = req.body;

  // Validate fields
  if (!name || !email || !staffRole || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff member with this email already exists" });
    }

    const newStaff = new Staff({
      name,
      email,
      staffRole,
      phoneNumber,
    });

    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(500).json({ message: "Error adding staff member", error });
  }
});

// @route PUT /api/staff/:id
// @desc Update a staff member
router.put("/:id", async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: "Error updating staff member", error });
  }
});

// @route DELETE /api/staff/:id
// @desc Delete a staff member
router.delete("/:id", async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff member", error });
  }
});

module.exports = router;
