const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Destination = require("../models/Destination");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "destinations",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const parser = multer({ storage });

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json({ destinations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single destination by ID
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination)
      return res.status(404).json({ error: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create destination
router.post("/", adminAuth, parser.single("imgFile"), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const img = req.file.path;

    const newDestination = new Destination({ title, subtitle, img });
    await newDestination.save();

    res.status(201).json(newDestination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update destination
router.put("/:id", adminAuth, parser.single("imgFile"), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const updateData = { title, subtitle };

    if (req.file) {
      updateData.img = req.file.path;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedDestination)
      return res.status(404).json({ error: "Destination not found" });

    res.json(updatedDestination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE destination
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedDestination = await Destination.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDestination)
      return res.status(404).json({ error: "Destination not found" });

    res.json({ message: "Destination deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
