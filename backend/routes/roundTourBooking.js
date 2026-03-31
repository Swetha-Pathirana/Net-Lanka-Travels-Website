const express = require("express");
const router = express.Router();
const RoundTourBooking = require("../models/RoundTourBooking");
const adminAuth = require("../middleware/adminAuth");
const sendEmail = require("../utils/mailer");
const AdminNotification = require("../models/AdminNotification");

// Convert date to YYYY-MM-DD
const getDateOnly = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Create day-before reminder
const createDayBeforeReminder = async (booking, type) => {
  const bookingDateStr = getDateOnly(booking.startDate);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getDateOnly(tomorrow);

  if (bookingDateStr === tomorrowStr) {
    const exists = await AdminNotification.findOne({ bookingId: booking._id });
    if (!exists) {
      await AdminNotification.create({
        title: "Tour Reminder",
        message: `${type} tour booked by ${booking.name} is scheduled for tomorrow.`,
        bookingId: booking._id,
        bookingType: type,
      });
    }
  }
};

// ---------------- CREATE BOOKING ----------------
router.post("/", async (req, res) => {
  try {
    let {
      tourId,
      name,
      email,
      phone,
      adults = 1,
      children = 0,
      pickupLocation,
      startDate,
      startTime,
      message,
      taxiId,
      travelStyle,
      accommodation,
      hotelCategory,
      travelPurpose,
    } = req.body;

    // Determine purpose
    const purpose =
    travelPurpose === "Other" ? customTravelPurpose || "" : travelPurpose || "";

    // Basic validations
    if (!tourId)
      return res.status(400).json({ success: false, error: "tourId is required" });

    if (!accommodation)
      return res.status(400).json({ success: false, error: "Accommodation is required" });

    if (accommodation === "with" && !hotelCategory)
      return res.status(400).json({
        success: false,
        error: "Hotel category is required when accommodation is selected",
      });

    // If accommodation is "without", ignore hotelCategory
    if (accommodation === "without") hotelCategory = undefined;

    // Prepare booking object
    const bookingData = {
      tourId,
      name,
      email,
      phone,
      adults,
      children,
      pickupLocation,
      startDate: new Date(startDate),
      startTime,
      message,
      taxiId,
      travelStyle,
      accommodation,
      hotelCategory,
      purpose, 
    };

    const booking = await RoundTourBooking.create(bookingData);

    // Optional: populate tour & taxi for email or response
    await booking.populate([
      { path: "tourId", select: "title location" },
      { path: "taxiId", select: "name seats ac transmission" },
    ]);

    const accommodationText =
      booking.accommodation === "with"
        ? `With Accommodation (${booking.hotelCategory.replace("_", " ")})`
        : "Without Accommodation";

    const adminEmail = process.env.EMAIL_USER;
    const adminSubject = `New Round Tour Booking`;

    const adminHtml = `
<div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
  <h2 style="color: #0d203a;">New Round Tour Booking Received</h2>
  <p>Dear Admin,</p>
  <p>A new round tour booking has been submitted. Details are below:</p>

  <table style="width: 100%; border-collapse: collapse; max-width: 600px; margin-top: 10px;">
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Field</th>
      <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Details</th>
    </tr>

    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Name</td><td style="border:1px solid #1a354e; padding:8px;">${name}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Email</td><td style="border:1px solid #1a354e; padding:8px;">${email}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Phone</td><td style="border:1px solid #1a354e; padding:8px;">${phone}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Tour</td><td style="border:1px solid #1a354e; padding:8px;">${
      booking.tourId?.title || "—"
    }</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Location</td><td style="border:1px solid #1a354e; padding:8px;">${
      booking.tourId?.location || "—"
    }</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Travel Style</td><td style="border:1px solid #1a354e; padding:8px;">${
      booking.travelStyle || "—"
    }</td></tr>
    <tr>
    <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Purpose</td>
    <td style="border: 1px solid #1a354e; padding: 8px;">${
      booking.purpose || "—"
    }</td>
  </tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Accommodation</td><td style="border:1px solid #1a354e; padding:8px;">${accommodationText}</td></tr>

    <tr>
      <td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Vehicle</td>
      <td style="border:1px solid #1a354e; padding:8px;">
        ${
          booking.taxiId
            ? `${booking.taxiId.name} – Seats: ${booking.taxiId.seats} - ${
                booking.taxiId.ac ? "AC" : "Non-AC"
              }`
            : "—"
        }
      </td>
    </tr>

    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Adults</td><td style="border:1px solid #1a354e; padding:8px;">${adults}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Children</td><td style="border:1px solid #1a354e; padding:8px;">${children}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Pickup Location</td><td style="border:1px solid #1a354e; padding:8px;">${pickupLocation}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Date & Time</td><td style="border:1px solid #1a354e; padding:8px;">${startDate} at ${startTime}</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Message</td><td style="border:1px solid #1a354e; padding:8px;">${
      message || "N/A"
    }</td></tr>
  </table>

  <p style="margin-top: 15px;">Best Regards,<br/><strong>Net Lanka Travels</strong></p>
</div>
`;

    sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });

    const userSubject = `Booking Received - Net Lanka Travels`;

    const userHtml = `
<div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
  <h2 style="color: #0d203a;">Booking Received – Thank You!</h2>
  <p>Dear <strong>${name}</strong>,</p>

  <p>Thank you for submitting your round tour booking with <strong>Net Lanka Travels</strong>. Our team will contact you shortly to confirm.</p>

  <h3 style="color: #0d203a;">Your Booking Details</h3>

  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Tour</td><td style="border:1px solid #1a354e; padding:8px;">${
      booking.tourId?.title || "—"
    }</td></tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Travel Style</td><td style="border:1px solid #1a354e; padding:8px;">${
      booking.travelStyle || "—"
    }</td></tr>
    <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Purpose</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${
              booking.purpose || "—"
            }</td>
          </tr>
    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Accommodation</td><td style="border:1px solid #1a354e; padding:8px;">${accommodationText}</td></tr>

    <tr>
      <td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Vehicle</td>
      <td style="border:1px solid #1a354e; padding:8px;">
        ${booking.taxiId ? booking.taxiId.name : "—"}
      </td>
    </tr>

    <tr><td style="border:1px solid #1a354e; padding:8px; font-weight:bold;">Pickup Date & Time</td><td style="border:1px solid #1a354e; padding:8px;">${startDate} at ${startTime}</td></tr>
  </table>

  <p style="margin-top: 15px;">If you have any questions, contact us at <strong>+94 705 325 512</strong>.</p>

  <p>Best Regards,<br/><strong>Net Lanka Travels</strong></p>
</div>
`;

    sendEmail({ to: email, subject: userSubject, html: userHtml });

    await createDayBeforeReminder(booking, "Round");

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, error: err.message });
    }

    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------------- GET ALL BOOKINGS ----------------
router.get("/", adminAuth, async (req, res) => {
  try {
    const bookings = await RoundTourBooking.find()
      .populate("tourId", "title location")
      .populate("taxiId", "name seats ac transmission")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------------- UPDATE STATUS ----------------
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const booking = await RoundTourBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------------- DELETE ----------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const booking = await RoundTourBooking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
