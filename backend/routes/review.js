const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const adminAuth = require("../middleware/adminAuth");

// CREATE REVIEW
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      return res.json({ success: false, msg: "All fields are required" });
    }

    const newReview = await Review.create({ name, email, rating, message });

    res.json({ success: true, msg: "Review submitted successfully", review: newReview });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Server Error" });
  }
});

// GET ALL REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Failed to fetch reviews" });
  }
});

// DELETE review
router.delete("/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ success: false, msg: "Review not found" });
  
      await Review.findByIdAndDelete(id);
      res.json({ success: true, msg: "Review deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: "Server error" });
    }
  });  

module.exports = router;
