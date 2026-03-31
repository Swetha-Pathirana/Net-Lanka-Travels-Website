const express = require("express");
const BlogComment = require("../models/BlogComment");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// GET all comments
router.get("/", async (req, res) => {
  try {
    const comments = await BlogComment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST a new comment for a blog
router.post("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, email, rating, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const newComment = new BlogComment({
      blogId,
      name,
      email,
      rating,
      message,
    });

    await newComment.save();

    res.status(201).json({ success: true, message: "Comment submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET all comments for a blog
router.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await BlogComment.find({ blogId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE a comment by ID
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await BlogComment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
