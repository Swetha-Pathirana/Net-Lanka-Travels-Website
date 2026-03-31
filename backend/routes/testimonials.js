const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const adminAuth = require("../middleware/adminAuth");

// Create a new testimonial
router.post("/", async (req, res) => {
  try { 
    const { title, text, name, email, rating } = req.body;
    const testimonial = new Testimonial({ title, text, name, email, rating });
    await testimonial.save();
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE a testimonial by ID
router.delete("/:id", adminAuth, async (req, res) => {
    try {
      const deleted = await Testimonial.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
      }
      res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });  

module.exports = router;
