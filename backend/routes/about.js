const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const About = require("../models/About");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "about";
    if (file.fieldname.startsWith("featureImages")) folder += "/features";
    else if (file.fieldname.startsWith("teamImages")) folder += "/team";
    else if (file.fieldname.startsWith("galleryFiles")) folder += "/gallery";

    return {
      folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// GET About data
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST About data
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");
    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    // Handle feature images
    if (data.features && Array.isArray(data.features)) {
      const featureFiles = req.files.filter((f) =>
        f.fieldname.startsWith("featureImages")
      );
      data.features = data.features.map((feat, idx) => {
        const file = featureFiles.find(
          (f) => f.fieldname === `featureImages${idx}`
        );
        return { ...feat, image: file ? file.path : feat.image || "" };
      });
    }

    // Handle team images
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
      const teamFiles = req.files.filter((f) =>
        f.fieldname.startsWith("teamImages")
      );
      data.teamMembers = data.teamMembers.map((member, idx) => {
        const file = teamFiles.find((f) => f.fieldname === `teamImages${idx}`);
        return { ...member, image: file ? file.path : member.image || "" };
      });
    }

    // Handle gallery files
    if (!data.gallery) data.gallery = [];
    const galleryFiles = req.files.filter(
      (f) => f.fieldname === "galleryFiles"
    );
    data.gallery.push(...galleryFiles.map((f) => f.path));

    // Save or update
    const updatedAbout = await About.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(updatedAbout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
