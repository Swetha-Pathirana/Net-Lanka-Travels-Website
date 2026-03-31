const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Experience = require("../models/Experience");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------- Cloudinary Storage ----------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "experiences";

    if (file.fieldname === "heroImg") folder += "/hero";
    else if (file.fieldname === "mainImg") folder += "/main";
    else if (file.fieldname.startsWith("subExperienceImages")) folder += "/sub";
    else if (file.fieldname.startsWith("galleryFiles")) folder += "/gallery";

    return {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({ storage });

// =============GET ALL EXPERIENCES============
router.get("/", async (req, res) => {
  try {
    const all = await Experience.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET experience by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const exp = await Experience.findOne({ slug: req.params.slug });
    if (!exp) return res.status(404).json({ message: "Experience not found" });
    res.json(exp);
  } catch (err) {
    console.error("Error fetching experience by slug:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==============GET SINGLE EXPERIENCE==============
router.get("/:id", async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: "Experience not found" });
    res.json(exp);
  } catch (err) {
    console.error("Error fetching single experience:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================CREATE EXPERIENCE================
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data received");

    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const hero = req.files.find((f) => f.fieldname === "heroImg");
    if (hero) data.heroImg = hero.path;

    const main = req.files.find((f) => f.fieldname === "mainImg");
    if (main) data.mainImg = main.path;

    if (data.subExperiences && Array.isArray(data.subExperiences)) {
      const subFiles = req.files.filter((f) =>
        f.fieldname.startsWith("subExperienceImages")
      );

      // Remove any existing _id and attach uploaded images
      data.subExperiences = data.subExperiences.map((item, idx) => {
        const file = subFiles.find(
          (f) => f.fieldname === `subExperienceImages${idx}`
        );
        const { _id, ...rest } = item;
        return { ...rest, image: file ? file.path : rest.image || "" };
      });
    }

    // ------------ Gallery upload ----------
    const galleryFiles = req.files.filter(
      (f) => f.fieldname === "galleryFiles"
    );
    data.gallery = galleryFiles.map((f) => f.path);

    const saved = await Experience.create(data);
    res.json(saved);
  } catch (err) {
    console.error("Error creating experience:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========UPDATE EXPERIENCE=====================
router.put("/:id", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data received");

    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ error: "Experience not found" });

    const hero = req.files.find((f) => f.fieldname === "heroImg");
    if (hero) data.heroImg = hero.path;

    const main = req.files.find((f) => f.fieldname === "mainImg");
    if (main) data.mainImg = main.path;

    if (data.subExperiences && Array.isArray(data.subExperiences)) {
      const subFiles = req.files.filter((f) =>
        f.fieldname.startsWith("subExperienceImages")
      );

      data.subExperiences = data.subExperiences.map((item, idx) => {
        const file = subFiles.find(
          (f) => f.fieldname === `subExperienceImages${idx}`
        );
        return { ...item, image: file ? file.path : item.image || "" };
      });
    }

    let updatedGallery = experience.gallery || [];

    if (data.removeGallery && Array.isArray(data.removeGallery)) {
      updatedGallery = updatedGallery.filter(
        (url) => !data.removeGallery.includes(url)
      );
    }

    const galleryFiles = req.files.filter(
      (f) => f.fieldname === "galleryFiles"
    );
    updatedGallery.push(...galleryFiles.map((f) => f.path));
    data.gallery = updatedGallery;

    const updated = await Experience.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================DELETE EXPERIENCE=============================
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
