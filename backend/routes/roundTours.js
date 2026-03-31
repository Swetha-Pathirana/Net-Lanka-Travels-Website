const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const slugify = require("slugify");
const RoundTour = require("../models/RoundTour");
const RoundTourDetail = require("../models/RoundTourDetail");
const adminAuth = require("../middleware/adminAuth");
 
// Cloudinary setup
const storage = new CloudinaryStorage({ cloudinary, params: { folder: "round-tours" } });
const upload = multer({ storage });

// ------------------------ GET ALL TOURS (cards) ------------------------
router.get("/", async (req, res) => {
  try {
    const tours = await RoundTour.find().sort({ createdAt: 1 }); // oldest first
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

    const tour = await RoundTour.findById(id);
    if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

    const details = await RoundTourDetail.findOne({ tourId: id }) || {};

    res.json({ success: true, tour, details });
  } catch (err) {
    console.error("GET /id/:id error:", err);
    res.status(500).json({ success: false, error: "Server error fetching tour" });
  }
});

// Get by slug (for user/public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const tour = await RoundTour.findOne({ slug: req.params.slug });
    if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

    const details = await RoundTourDetail.findOne({ tourId: tour._id }) || {};

    res.json({ success: true, tour, details });
  } catch (err) {
    console.error("GET /slug/:slug error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE tour
router.post("/", adminAuth, upload.single("img"), async (req, res) => {
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const tour = await RoundTour.create({
    title: req.body.title,
    slug,
    days: req.body.days,
    location: req.body.location,
    desc: req.body.desc,
    img: req.file.path,
  });
  res.json({ success: true, tour });
});

// CREATE tour detail
router.post("/detail", adminAuth, upload.any(), async (req, res) => {
  const gallerySlides = JSON.parse(req.body.gallerySlides || "[]");
  gallerySlides.forEach((s, i) => {
    const f = req.files.find(f => f.fieldname === `galleryImage_${i}`);
    if (f) s.image = f.path;
  });
  const heroFile = req.files.find(f => f.fieldname === "heroImage");
  const detail = await RoundTourDetail.create({
    tourId: req.body.tourId,
    heroImage: heroFile?.path || "",
    heroTitle: req.body.heroTitle,
    heroSubtitle: req.body.heroSubtitle,
    highlights: JSON.parse(req.body.highlights || "[]"),
    itinerary: JSON.parse(req.body.itinerary || "[]"),
    inclusions: JSON.parse(req.body.inclusions || "[]"),
    exclusions: JSON.parse(req.body.exclusions || "[]"),
    offers: JSON.parse(req.body.offers || "[]"),
    tourFacts: JSON.parse(req.body.tourFacts || "{}"),
    gallerySlides,
  });
  res.json({ success: true, detail });
});

// UPDATE tour
router.put("/:id", adminAuth, upload.single("img"), async (req, res) => {
  const data = { title: req.body.title, days: req.body.days, location: req.body.location, desc: req.body.desc };
  if (req.file) data.img = req.file.path;
  const tour = await RoundTour.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json({ success: true, tour });
});

// UPDATE tour detail
router.put("/detail/:id", adminAuth, upload.any(), async (req, res) => {
  const gallerySlides = JSON.parse(req.body.gallerySlides || "[]");
  gallerySlides.forEach((s, i) => {
    const f = req.files.find(f => f.fieldname === `galleryImage_${i}`);
    if (f) s.image = f.path;
  });
  const heroFile = req.files.find(f => f.fieldname === "heroImage");
  const update = {
    heroTitle: req.body.heroTitle,
    heroSubtitle: req.body.heroSubtitle,
    highlights: JSON.parse(req.body.highlights || "[]"),
    itinerary: JSON.parse(req.body.itinerary || "[]"),
    inclusions: JSON.parse(req.body.inclusions || "[]"),
    exclusions: JSON.parse(req.body.exclusions || "[]"),
    offers: JSON.parse(req.body.offers || "[]"),
    tourFacts: JSON.parse(req.body.tourFacts || "{}"),
    gallerySlides,
  };
  if (heroFile) update.heroImage = heroFile.path;
  const detail = await RoundTourDetail.findOneAndUpdate({ tourId: req.params.id }, update, { new: true, upsert: true });
  res.json({ success: true, detail });
});

// DELETE tour + detail
router.delete("/:id", adminAuth, async (req, res) => {
  await RoundTour.findByIdAndDelete(req.params.id);
  await RoundTourDetail.deleteOne({ tourId: req.params.id });
  res.json({ success: true });
});

module.exports = router;
