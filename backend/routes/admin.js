const express = require("express");
const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // 🔥 Add this check
    if (admin.isActive === false) {
      return res.status(403).json({ message: "Your account is deactivated. Contact SuperAdmin." });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: admin._id, email: admin.email, role: "admin" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Route accessible by both Admin and SuperAdmin
router.get("/profile", adminAuth, async (req, res) => {
  try {
    res.json(req.admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new admin (SuperAdmin only)
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;
    const SuperAdmin = require("../models/SuperAdmin");

    // Only SuperAdmin can create new admin
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin")
      return res.status(403).json({ message: "Forbidden" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({ email, password });
    res.json({
      message: "Admin created",
      admin: { id: newAdmin._id, email: newAdmin.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
