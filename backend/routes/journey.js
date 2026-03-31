const express = require("express");
const Journey = require("../models/Journey");
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
  params: async (req, file) => {
    let folder = "journey";
    if (file.fieldname.startsWith("milestones")) folder += "/milestones";
    return {
      folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// ---------------- GET JOURNEY ----------------
router.get("/", async (req, res) => {
  try {
    const journey = await Journey.findOne();
    res.json(journey || {});
  } catch (err) {
    console.error("GET /api/journey:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CREATE / UPDATE JOURNEY ----------------
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");

    let data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    // Milestone images
    if (data.milestones && Array.isArray(data.milestones)) {
      data.milestones = data.milestones.map((milestone, idx) => {
        const file = req.files.find(
          (f) => f.fieldname === `milestones[${idx}][image]`
        );
        return {
          year: milestone.year,
          title: milestone.title,
          description: milestone.description || "",
          image: file ? file.path : milestone.image || "",
        };
      });
    }

    const commonFile = req.files.find((f) => f.fieldname === "commonImage");
    if (commonFile) {
      data.commonImage = commonFile.path;
    } else if (data.commonImage) {
      data.commonImage = data.commonImage;
    }

    if (!data.fullDescription) data.fullDescription = [{ description: "" }];

    let journey = await Journey.findOne();
    if (!journey) {
      journey = await Journey.create(data);
    } else {
      Object.assign(journey, data);
      await journey.save();
    }

    res.json(journey);
  } catch (err) {
    console.error("POST /api/journey:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE MILESTONE ----------------
router.delete("/milestone/:index", adminAuth, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx)) throw new Error("Invalid index");

    const journey = await Journey.findOne();
    if (!journey) return res.status(404).json({ message: "Journey not found" });

    if (journey.milestones[idx]) journey.milestones.splice(idx, 1);
    await journey.save();
    res.json(journey);
  } catch (err) {
    console.error("DELETE /api/journey/milestone/:index:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE FULL DESCRIPTION PARAGRAPH ----------------
router.delete("/paragraph/:index", adminAuth, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx)) throw new Error("Invalid index");

    const journey = await Journey.findOne();
    if (!journey) return res.status(404).json({ message: "Journey not found" });

    if (journey.fullDescription[idx]) journey.fullDescription.splice(idx, 1);
    await journey.save();
    res.json(journey);
  } catch (err) {
    console.error("DELETE /api/journey/paragraph/:index:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DELETE WHOLE JOURNEY ----------------
router.delete("/", adminAuth, async (req, res) => {
  try {
    await Journey.deleteMany();
    res.json({ message: "Journey deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/journey:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
