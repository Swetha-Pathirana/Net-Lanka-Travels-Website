const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const EventDetail = require("../models/EventDetail");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const adminAuth = require("../middleware/adminAuth");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "events" },
});
const upload = multer({ storage });

// ------------------------ GET ALL EVENTS ------------------------
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------ GET SINGLE EVENT + DETAIL ------------------------

// Get by ID (for admin)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });

    const detail = await EventDetail.findOne({ eventId: id }) || {};

    res.json({ success: true, event, detail });
  } catch (err) {
    console.error("GET /id/:id error:", err);
    res.status(500).json({ success: false, error: "Server error fetching event" });
  }
});

// Get by slug (for public users)
router.get("/slug/:slug", async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });

    const detail = await EventDetail.findOne({ eventId: event._id }) || {};

    res.json({ success: true, event, detail });
  } catch (err) {
    console.error("GET /slug/:slug error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- CREATE EVENT ----------
router.post("/", adminAuth, upload.single("img"), async (req, res) => {
  try {
    const newEvent = new Event({
      title: req.body.title || "",
      slug: req.body.slug || "",
      location: req.body.location || "",
      date: req.body.date || "",
      desc: req.body.desc || "",
      img: req.file ? req.file.path : "",
    });
    await newEvent.save();
    res.json({ success: true, event: newEvent });
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- CREATE EVENT DETAIL ----------
router.post("/detail", adminAuth, upload.any(), async (req, res) => {
  console.log("Body:", req.body);
  console.log("Files:", req.files);

  try {
    const files = req.files || [];
    const galleryImgs = files
      .filter((f) => f.fieldname.startsWith("galleryImg"))
      .map((f) => f.path);
    const heroFile = files.find((f) => f.fieldname === "heroImage");

    const newDetail = new EventDetail({
      eventId: req.body.eventId || "",
      heroTitle: req.body.heroTitle || "",
      heroSubtitle: req.body.heroSubtitle || "",
      heroImage: heroFile ? heroFile.path : "",
      aboutParagraphs: req.body.aboutParagraphs
        ? JSON.parse(req.body.aboutParagraphs)
        : [],
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      duration: req.body.duration || "",
      includes: req.body.includes ? JSON.parse(req.body.includes) : [],
      startLocation: req.body.startLocation || "",
      galleryImgs,
      whyShouldAttend: req.body.whyShouldAttend || "",
      whoShouldAttend: req.body.whoShouldAttend || "",
      tipsForAttendees: req.body.tipsForAttendees || "",
      planYourVisit: req.body.planYourVisit || "",
    });

    await newDetail.save();
    res.json({ success: true, detail: newDetail });
  } catch (err) {
    console.error("Create EventDetail Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- UPDATE EVENT ----------
router.put("/:id", adminAuth, upload.single("img"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title || "",
      slug: req.body.slug || "",
      location: req.body.location || "",
      date: req.body.date || "",
      desc: req.body.desc || "",
    };
    if (req.file) updateData.img = req.file.path;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json({ success: true, event: updatedEvent });
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- UPDATE EVENT DETAIL ----------
router.put("/detail/:id", adminAuth, upload.any(), async (req, res) => {
  console.log("Body:", req.body);
  console.log("Files:", req.files);

  try {
    const files = req.files || [];
    const galleryImgs = files
      .filter((f) => f.fieldname.startsWith("galleryImg"))
      .map((f) => f.path);
    const heroFile = files.find((f) => f.fieldname === "heroImage");

    const updateData = {
      heroTitle: req.body.heroTitle || "",
      heroSubtitle: req.body.heroSubtitle || "",
      aboutParagraphs: req.body.aboutParagraphs
        ? JSON.parse(req.body.aboutParagraphs)
        : [],
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      duration: req.body.duration || "",
      includes: req.body.includes ? JSON.parse(req.body.includes) : [],
      startLocation: req.body.startLocation || "",
      whyShouldAttend: req.body.whyShouldAttend || "",
      whoShouldAttend: req.body.whoShouldAttend || "",
      tipsForAttendees: req.body.tipsForAttendees || "",
      planYourVisit: req.body.planYourVisit || "",
    };

    if (heroFile) updateData.heroImage = heroFile.path;
    if (galleryImgs.length) updateData.galleryImgs = galleryImgs;

    const updatedDetail = await EventDetail.findOneAndUpdate(
      { eventId: req.params.id },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ success: true, detail: updatedDetail });
  } catch (err) {
    console.error("Update EventDetail Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- DELETE EVENT + DETAIL ----------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await EventDetail.deleteOne({ eventId: req.params.id });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
