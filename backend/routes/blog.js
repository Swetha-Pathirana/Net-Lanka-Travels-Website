const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Blog = require("../models/Blog");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// -------------------- Cloudinary storage --------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "heroImg", maxCount: 1 },
  { name: "galleryImgs", maxCount: 5 },
]);

// -------------------- GET all blogs --------------------
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET blog by slug --------------------
router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET blog by ID --------------------
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CREATE blog --------------------
router.post("/", adminAuth, uploadFields, async (req, res) => {
  try {
    const { title, slug, subtitle, description, content } = req.body;

    if (!req.files?.heroImg) {
      return res.status(400).json({ error: "Hero image required" });
    }

    const heroImg = req.files.heroImg[0].path;

    const galleryImgs = req.files.galleryImgs
      ? req.files.galleryImgs.map((img) => img.path)
      : [];

    const newBlog = new Blog({
      title,
      slug,
      subtitle,
      description,
      content,
      heroImg,
      galleryImgs,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- UPDATE blog --------------------
router.put("/:id", adminAuth, uploadFields, async (req, res) => {
  try {
    const { title, slug, subtitle, description, content } = req.body;

    const updateData = {
      title,
      slug,
      subtitle,
      description,
      content,
    };

    if (req.files?.heroImg) {
      updateData.heroImg = req.files.heroImg[0].path;
    }

    if (req.files?.galleryImgs) {
      updateData.galleryImgs = req.files.galleryImgs.map(
        (img) => img.path
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ error: "Blog not found" });

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- DELETE blog --------------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog)
      return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
