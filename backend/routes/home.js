const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Home = require("../models/Home");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for images/videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "home";
    if (file.fieldname === "infoVideo") folder += "/video";
    else folder += "/images";

    return {
      folder,
      resource_type: file.fieldname === "infoVideo" ? "video" : "image", // 🔑 video explicitly
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// GET Home data
router.get("/", async (req, res) => {
  try {
    const home = await Home.findOne();
    res.json(home || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / update Home data
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");
    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    // Handle info video
    const videoFile = req.files.find((f) => f.fieldname === "infoVideo");
    if (videoFile) data.info.video = videoFile.path;

    // Handle icons/images
    const imageFiles = req.files.filter((f) => f.fieldname !== "infoVideo");

    if (data.stats && Array.isArray(data.stats)) {
      data.stats = data.stats.map((item, idx) => {
        const file = imageFiles.find((f) => f.fieldname === `stats${idx}`);
        return { ...item, icon: file ? file.path : item.icon || "" };
      });
    }

    if (data.topActivities && Array.isArray(data.topActivities)) {
      data.topActivities = data.topActivities.map((item, idx) => {
        const file = imageFiles.find((f) => f.fieldname === `activities${idx}`);
        return { ...item, icon: file ? file.path : item.icon || "" };
      });
    }

    if (data.whyChooseUs && Array.isArray(data.whyChooseUs)) {
      data.whyChooseUs = data.whyChooseUs.map((item, idx) => {
        const file = imageFiles.find((f) => f.fieldname === `choose${idx}`);
        return { ...item, icon: file ? file.path : item.icon || "" };
      });
    }

    // Save or update
    const updatedHome = await Home.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(updatedHome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
