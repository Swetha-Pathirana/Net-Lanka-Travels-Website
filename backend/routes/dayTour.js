const express = require("express");
const router = express.Router();
const DayTour = require("../models/DayTour");
const DayTourDetail = require("../models/DayTourDetail");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const adminAuth = require("../middleware/adminAuth");
const slugify = require("slugify");

// ------------------------ Cloudinary Upload Setup ------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "day-tours" },
});
const upload = multer({ storage });

// ------------------------ GET ALL TOURS (cards) ------------------------
router.get("/", async (req, res) => {
  try {
    const tours = await DayTour.find();
    res.json({ success: true, tours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------ GET SINGLE TOUR + DETAILS ------------------------
// Get by ID (for admin)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid tour ID" });
    }

    const tour = await DayTour.findById(id);
    if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

    const details = await DayTourDetail.findOne({ tourId: id }) || {};

    res.json({ success: true, tour, details });
  } catch (err) {
    console.error("GET /id/:id error:", err);
    res.status(500).json({ success: false, error: "Server error fetching tour" });
  }
});

// Get by slug (for user)
router.get("/slug/:slug", async (req, res) => {
  const tour = await DayTour.findOne({ slug: req.params.slug });
  if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });
  const details = await DayTourDetail.findOne({ tourId: tour._id });
  res.json({ success: true, tour, details });
});

// ------------------------ ADMIN — CREATE LIST ITEM ------------------------
router.post("/", adminAuth, upload.single("img"), async (req, res) => {
  try {
    const slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });

    const newTour = new DayTour({
      title: req.body.title,
      slug,
      location: req.body.location,
      desc: req.body.desc,
      img: req.file.path,
    });

    await newTour.save();
    res.json({ success: true, tour: newTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------ ADMIN — CREATE DETAIL ITEM -----------------------
router.post("/detail", adminAuth, upload.any(), async (req, res) => {
  try {
    const gallerySlides = JSON.parse(req.body.gallerySlides || "[]");

    // Attach uploaded images dynamically
    gallerySlides.forEach((slide, idx) => {
      const fileKey = `galleryImage_${idx}`;
      const uploadedFile = req.files.find((f) => f.fieldname === fileKey);
      if (uploadedFile) slide.image = uploadedFile.path;
      else slide.image = slide.image || "";
    });

    const heroFile = req.files.find((f) => f.fieldname === "heroImage");

    const newDetail = new DayTourDetail({
      tourId: req.body.tourId,
      heroImage: heroFile ? heroFile.path : "",
      heroTitle: req.body.heroTitle,
      heroSubtitle: req.body.heroSubtitle,
      aboutParagraphs: JSON.parse(req.body.aboutParagraphs || "[]"),
      historyTitle: req.body.historyTitle,
      historyLeftList: JSON.parse(req.body.historyLeftList || "[]"),
      historyRightList: JSON.parse(req.body.historyRightList || "[]"),
      gallerySlides,
      highlights: JSON.parse(req.body.highlights || "[]"),
      duration: req.body.duration || "",
      includes: JSON.parse(req.body.includes || "[]"),
      startLocation: req.body.startLocation || "",
    });
    

    await newDetail.save();
    res.json({ success: true, detail: newDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------ ADMIN — UPDATE LIST ITEM ------------------------
router.put("/:id", adminAuth, upload.single("img"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      location: req.body.location,
      desc: req.body.desc,
    };
    if (req.file) updateData.img = req.file.path;

    const updatedTour = await DayTour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    res.json({ success: true, tour: updatedTour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/detail/:id", adminAuth, upload.any(), async (req, res) => {
  try {
    const gallerySlides = JSON.parse(req.body.gallerySlides || "[]");

    // Attach uploaded images dynamically
    gallerySlides.forEach((slide, idx) => {
      const fileKey = `galleryImage_${idx}`;
      const uploadedFile = req.files.find((f) => f.fieldname === fileKey);
      if (uploadedFile) slide.image = uploadedFile.path;
      else slide.image = slide.image || "";
    });

    const updateData = {
      heroTitle: req.body.heroTitle,
      heroSubtitle: req.body.heroSubtitle,
      aboutParagraphs: JSON.parse(req.body.aboutParagraphs || "[]"),
      historyTitle: req.body.historyTitle,
      historyLeftList: JSON.parse(req.body.historyLeftList || "[]"),
      historyRightList: JSON.parse(req.body.historyRightList || "[]"),
      gallerySlides,
      highlights: JSON.parse(req.body.highlights || "[]"),
      duration: req.body.duration || "",
      includes: JSON.parse(req.body.includes || "[]"),
      startLocation: req.body.startLocation || "",
    };
    

    const heroFile = req.files.find((f) => f.fieldname === "heroImage");
    if (heroFile) updateData.heroImage = heroFile.path;

    // Find by tourId instead of _id
    const updatedDetail = await DayTourDetail.findOneAndUpdate(
      { tourId: req.params.id },
      updateData,
      { new: true, upsert: true }
    );

    if (!updatedDetail) {
      return res
        .status(404)
        .json({ success: false, error: "Detail not found" });
    }

    res.json({ success: true, detail: updatedDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------- ADMIN — DELETE TOUR + DETAIL ------------------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const tour = await DayTour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    await DayTourDetail.deleteOne({ tourId: req.params.id });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔧 TEMP FIX: Generate slugs for old tours
router.post("/fix-slugs", async (req, res) => {
  const slugify = require("slugify");
  const DayTour = require("../models/DayTour");

  try {
    const tours = await DayTour.find({ slug: { $exists: false } });

    for (const tour of tours) {
      tour.slug = slugify(tour.title, {
        lower: true,
        strict: true,
      });
      await tour.save();
    }

    res.json({
      success: true,
      fixed: tours.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Slug fix failed" });
  }
});

module.exports = router;
