const express = require("express");
const CommunityImpact = require("../models/CommunityImpact");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- MULTER STORAGE ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "community/impacts",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// ---------------- GET COMMUNITY IMPACT ----------------
router.get("/", async (req, res) => {
  try {
    const community = await CommunityImpact.findOne();
    res.json(community || { description: [""], impacts: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CREATE / UPDATE COMMUNITY IMPACT ----------------
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");

    let data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    data.impacts = data.impacts.map((impact, index) => {
      const imageFiles = req.files.filter(
        (f) => f.fieldname === `impactImages_${index}`
      );

      return {
        title: impact.title,
        description: impact.description,
        images: imageFiles.length
          ? [...(impact.existingImages || []), ...imageFiles.map((f) => f.path)]
          : impact.images || [],
      };
    });

    if (!Array.isArray(data.description))
      data.description = [data.description || ""];

    let community = await CommunityImpact.findOne();
    if (!community) {
      community = await CommunityImpact.create(data);
    } else {
      Object.assign(community, data);
      await community.save();
    }

    res.json(community);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE SINGLE IMPACT ----------------
router.delete("/impact/:index", adminAuth, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx)) throw new Error("Invalid index");

    const community = await CommunityImpact.findOne();
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.impacts[idx]) community.impacts.splice(idx, 1);
    await community.save();
    res.json(community);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE WHOLE COMMUNITY ----------------
router.delete("/", adminAuth, async (req, res) => {
  try {
    await CommunityImpact.deleteMany();
    res.json({ message: "Community impacts deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
