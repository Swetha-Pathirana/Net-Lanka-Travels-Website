const express = require("express");
const TourReview = require("../models/TourReviews");
const router = express.Router();

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { tourId, name, email, rating, message } = req.body;

    if (!tourId || !name || !email || !rating || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newReview = new TourReview({
      tourId,
      name,
      email,
      rating,
      message,
    });

    await newReview.save();
    res
      .status(201)
      .json({ success: true, message: "Review submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET all reviews (for admin)
router.get("/", async (req, res) => {
  try {
    const reviews = await TourReview.find()
      .populate("tourId", "title type")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a review by ID (admin only)
const adminAuth = require("../middleware/adminAuth");
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await TourReview.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
