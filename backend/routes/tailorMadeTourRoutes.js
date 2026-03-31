const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const TailorMadeTour = require("../models/TailorMadeTour");
const Inquiry = require("../models/TailorMadeTourInquiry");
const adminAuth = require("../middleware/adminAuth");
const sendEmail = require("../utils/mailer");

const router = express.Router();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- MULTER CONFIG ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "tailorMadeTour";
    if (file.fieldname.startsWith("howItWorks")) folder += "/howItWorks";
    else if (file.fieldname.startsWith("gallery")) folder += "/gallery";

    return {
      folder,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "webp"],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// ---------------- GET TAILOR MADE TOUR ----------------
router.get("/", async (req, res) => {
  try {
    const tour = await TailorMadeTour.findOne();
    res.json(tour || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE TAILOR MADE TOUR (ADMIN) ----------------
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");

    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    data.howItWorks = Array.isArray(data.howItWorks) ? data.howItWorks : [];
    data.gallery = Array.isArray(data.gallery) ? data.gallery : [];
    data.fullDescription = Array.isArray(data.fullDescription)
      ? data.fullDescription
      : [];

    data.phone = data.phone || "";
    data.whatsapp = data.whatsapp || "";

    const howFiles = req.files.filter((f) =>
      f.fieldname.startsWith("howItWorks")
    );

    data.howItWorks = data.howItWorks.map((item, idx) => {
      const file = howFiles.find((f) => f.fieldname === `howItWorks${idx}`);
      return { ...item, image: file ? file.path : item.image || "" };
    });

    const galleryFiles = req.files.filter(
      (f) => f.fieldname === "galleryFiles"
    );

    const newGalleryImages = galleryFiles.map((f) => f.path);
    const MAX_GALLERY_IMAGES = 6;

    data.gallery = [...data.gallery, ...newGalleryImages].slice(
      0,
      MAX_GALLERY_IMAGES
    );

    const updatedTour = await TailorMadeTour.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    res.json(updatedTour);
  } catch (err) {
    console.error("Failed to update Tailor Made Tour:", err);
    res.status(500).json({ error: "Failed to update Tailor Made Tour" });
  }
});

// ---------------- SAVE USER INQUIRY ----------------
router.post("/inquiry", async (req, res) => {
  try {
    const inquiryData = {
      title: req.body.title,
      fullName: req.body.fullName,
      country: req.body.country,
      email: req.body.email,
      phone: req.body.phone,
      tourType: req.body.tourType || "Budget",
      pickupLocation: req.body.pickupLocation,
      dropLocation: req.body.dropLocation,
      vehicle: req.body.vehicle || null,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      adults: req.body.adults,
      children: req.body.children,
      selectedDestinations: req.body.selectedDestinations || [],
      selectedExperiences: req.body.selectedExperiences || [],
      budget: req.body.currency === "No Idea" ? null : req.body.budget || null,
      currency: req.body.currency || "No Idea",
      notes: req.body.notes || "",
      hearAboutUs: req.body.hearAboutUs,
      accommodation: req.body.accommodation,
      travelStyle: req.body.travelStyle || null,
      purpose:
        req.body.travelPurpose === "Other"
          ? req.body.customTravelPurpose
          : req.body.travelPurpose || "",
      entranceFee: req.body.entranceFee || "Without",
    };

    // ✅ ONLY add hotelCategory when accommodation === "with"
    if (req.body.accommodation === "with") {
      inquiryData.hotelCategory = req.body.hotelCategory;
    }

    const inquiry = new Inquiry(inquiryData);
    const saved = await inquiry.save();

    // ---------------- SEND EMAIL TO ADMIN ----------------
    const adminEmail = process.env.EMAIL_USER;
    const adminSubject = `New Tailor-Made Tour Inquiry: ${inquiry.fullName}`;
    const adminHtml = `
      <h2>New Tailor-Made Tour Inquiry</h2>
      <p><strong>Name:</strong> ${inquiry.title} ${inquiry.fullName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone}</p>
      <p><strong>Country:</strong> ${inquiry.country}</p>
      <p><strong>Pickup Location:</strong> ${inquiry.pickupLocation}</p>
      <p><strong>Drop Location:</strong> ${inquiry.dropLocation}</p>
      <p><strong>Selected Vehicle:</strong> ${
        inquiry.vehicle || "Not Selected"
      }</p>
      <p><strong>Start Date:</strong> ${
        inquiry.startDate
          ? new Date(inquiry.startDate).toISOString().slice(0, 10)
          : "N/A"
      }</p>
      <p><strong>End Date:</strong> ${
        inquiry.endDate
          ? new Date(inquiry.endDate).toISOString().slice(0, 10)
          : "N/A"
      }</p>
      <p><strong>Accommodation:</strong> ${
        inquiry.accommodation === "with" && inquiry.hotelCategory
          ? `With accommodation (${inquiry.hotelCategory.replace("_", " ")})`
          : "Without accommodation"
      }</p>      
      <p><strong>Adults:</strong> ${inquiry.adults}</p>
      <p><strong>Children:</strong> ${inquiry.children}</p>
      <p><strong>Selected Destinations:</strong> ${
        inquiry.selectedDestinations.join(", ") || "N/A"
      }</p>
      <p><strong>Travel Style:</strong> ${inquiry.travelStyle}</p>
<p><strong>Purpose:</strong> ${inquiry.purpose}</p>

      <p><strong>Entrance Fee:</strong> ${inquiry.entranceFee}</p>
      <p><strong>Selected Experiences:</strong> ${
        inquiry.selectedExperiences.length
          ? inquiry.selectedExperiences.join(", ")
          : "Not Selected"
      }</p>
      <p><strong>Budget:</strong> ${
        inquiry.budget ? inquiry.budget + " " + inquiry.currency : "No Idea"
      }</p>
      <p><strong>How Did You Hear About Us:</strong> ${
        inquiry.hearAboutUs || "Not Provided"
      }</p>
      <p><strong>Notes:</strong> ${inquiry.notes || "N/A"}</p>
    `;
    await sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });

    // ---------------- SEND EMAIL TO USER ----------------
    const userSubject = "Inquiry Received – Net Lanka Travels";
    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
        <h2 style="color: #0d203a;">Inquiry Received – Thank You!</h2>
        <p>Dear <strong>${inquiry.title} ${inquiry.fullName}</strong>,</p>
        <p>Thank you for submitting your tailor-made tour inquiry with <strong>Net Lanka Travels</strong>! Our team is reviewing your request and will contact you shortly to plan your trip.</p>
        <h3 style="color: #0d203a;">Your Inquiry Details</h3>
        <table style="width:100%; border-collapse: collapse; margin-top:10px;">
        <tr>
  <td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">
    Vehicle
  </td>
  <td style="border:1px solid #1a354e; padding:8px;">
    ${inquiry.vehicle || "Not Selected"}
  </td>
</tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Pickup Location</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.pickupLocation
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Drop Location</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.dropLocation
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Start Date</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.startDate
              ? new Date(inquiry.startDate).toISOString().slice(0, 10)
              : "N/A"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">End Date</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.endDate
              ? new Date(inquiry.endDate).toISOString().slice(0, 10)
              : "N/A"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Accommodation</td>
          <td style="border:1px solid #1a354e; padding:8px;">
          ${
            inquiry.accommodation === "with" && inquiry.hotelCategory
              ? `With accommodation (${inquiry.hotelCategory.replace(
                  "_",
                  " "
                )})`
              : "Without accommodation"
          }
</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Adults</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.adults
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Children</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.children
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Selected Destinations</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.selectedDestinations.join(", ") || "N/A"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Travel Style</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.travelStyle || "Not Selected"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Travel Purpose</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.purpose || "Not Selected"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Entrance Fee</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.entranceFee || "Not Selected"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Selected Experiences</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.selectedExperiences.length
              ? inquiry.selectedExperiences.join(", ")
              : "Not Selected"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Budget</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.budget ? inquiry.budget + " " + inquiry.currency : "No Idea"
          }</td></tr>
          <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Notes</td><td style="border:1px solid #1a354e; padding:8px;">${
            inquiry.notes || "N/A"
          }</td></tr>
        </table>
        <p style="margin-top:15px;">If you have any questions, please reply to this email or call us at <strong>+94 771 234 567</strong>.</p>
        <p>Best Regards,<br/><strong>Net Lanka Travels</strong></p>
      </div>
    `;

    await sendEmail({
      to: inquiry.email,
      subject: userSubject,
      html: userHtml,
    });

    res.status(201).json({
      message: "Inquiry saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Inquiry save failed:", err);
    res.status(500).json({ message: "Failed to save inquiry" });
  }
});

// ---------------- GET ALL INQUIRIES (ADMIN) ----------------
router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
});

// ---------------- UPDATE INQUIRY STATUS ----------------
router.put("/inquiries/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    res.json(inquiry);
  } catch (err) {
    console.error("Failed to update inquiry status:", err);
    res.status(500).json({ message: "Failed to update inquiry" });
  }
});

// ---------------- DELETE INQUIRY ----------------
router.delete("/inquiries/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
});

module.exports = router;
