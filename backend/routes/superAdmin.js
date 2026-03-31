const express = require("express");
const SuperAdmin = require("../models/SuperAdmin");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Middleware to allow only SuperAdmin
const superAdminOnly = async (req, res, next) => {
  await adminAuth(req, res, async () => {
    if (req.admin && req.admin.role === "superadmin") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: SuperAdmin only" });
    }
  });
};

// SuperAdmin login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const superAdmin = await SuperAdmin.findOne({ email });
      if (!superAdmin) return res.status(401).json({ message: "Invalid credentials" });
  
      const isMatch = await superAdmin.matchPassword(password); // <-- use model method
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: superAdmin._id, role: "superadmin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({ token, user: { id: superAdmin._id, email: superAdmin.email, role: "superadmin" } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });  

  // --- GET: Admin counts ---
router.get("/admin-stats", superAdminOnly, async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments({ role: "admin" });
    const activeAdmins = await Admin.countDocuments({
      role: "admin",
      isActive: true,
    });
    const inactiveAdmins = await Admin.countDocuments({
      role: "admin",
      isActive: false,
    });

    res.json({
      totalAdmins,
      activeAdmins,
      inactiveAdmins,
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

// SuperAdmin-only route
router.get("/all-admins", superAdminOnly, async (req, res) => {
  try {
    const admins = await require("../models/Admin").find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
