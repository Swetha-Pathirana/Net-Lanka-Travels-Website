const express = require("express");
const router = express.Router();
const TripadvisorReview = require("../models/TripadvisorReview");
const adminAuth = require("../middleware/adminAuth");

// --- Middleware: SuperAdmin only ---
const superAdminOnly = async (req, res, next) => {
  await adminAuth(req, res, async () => {
    if (req.admin.role === "superadmin") next();
    else res.status(403).json({ message: "Forbidden: SuperAdmin only" });
  });
};

/**
 * ✅ CREATE – Super Admin only
 */
router.post("/", superAdminOnly, async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    const review = new TripadvisorReview({
      name,
      email,
      rating,
      message,
    });

    await review.save();

    res.status(201).json({
      success: true,
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * ✅ READ – Public
 */
router.get("/", async (req, res) => {
  try {
    const reviews = await TripadvisorReview.find()
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/**
 * ❌ DELETE – Super Admin only
 */
router.delete("/:id", superAdminOnly, async (req, res) => {
  try {
    await TripadvisorReview.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
