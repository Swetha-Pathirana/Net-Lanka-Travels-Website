const express = require("express");
const router = express.Router();
const TourBooking = require("../models/TourBooking");
const adminAuth = require("../middleware/adminAuth");
const sendEmail = require("../utils/mailer");
const { createDayBeforeReminder } = require("../utils/notification");

// Convert date to YYYY-MM-DD
const getDateOnly = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// ---------------- CREATE BOOKING ----------------
router.post("/", async (req, res) => {
  try {
    const {
      tourId,
      name,
      email,
      phone,
      adults,
      children,
      pickupLocation,
      startDate,
      startTime,
      message,
      tourType,
      taxiId,
      travelStyle,
      accommodation,
      hotelCategory,
      travelPurpose,
    } = req.body;

     // Determine purpose
     const purpose =
     travelPurpose === "Other" ? customTravelPurpose || "" : travelPurpose || "";

    if (!tourId) {
      return res
        .status(400)
        .json({ success: false, error: "tourId is required" });
    }

    // Validate accommodation for Round Tours
    if (tourType === "round" && !accommodation) {
      return res
        .status(400)
        .json({ success: false, error: "Accommodation is required for Round Tours" });
    }

    // Validate hotel category if accommodation is "with"
    if (accommodation === "with" && !hotelCategory) {
      return res
        .status(400)
        .json({ success: false, error: "Hotel category is required if accommodation is 'with'" });
    }

    const booking = await TourBooking.create({
      ...req.body,
      purpose, 
      accommodation: req.body.accommodation || undefined, 
      hotelCategory: req.body.hotelCategory || "",
      startDate: new Date(startDate),
    });
    
    // Populate both tourId and taxiId
    await booking.populate([
      { path: "tourId", select: "title location" },
      { path: "taxiId", select: "name seats ac transmission" },
    ]);

    // ---------------- SEND EMAIL TO ADMIN ----------------
    const adminEmail = process.env.EMAIL_USER;
    const adminSubject = `New ${tourType || "Tour"} Tour Booking`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
        <h2 style="color: #0d203a;">New ${tourType || "Tour"} Booking Received</h2>
        <p>Dear Admin,</p>
        <p>A new ${tourType || "tour"} booking has been submitted. Details are below:</p>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; max-width: 600px;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Field</th>
            <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Details</th>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Name</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Email</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Phone</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${phone}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Tour</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.tourId?.title || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Location</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.tourId?.location || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Style</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.travelStyle || "—"}</td>
          </tr>
          <tr>
          <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Purpose</td>
          <td style="border: 1px solid #1a354e; padding: 8px;">${
            booking.purpose || "—"
          }</td>
        </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Accommodation</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.accommodation || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Hotel Category</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.hotelCategory || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Vehicle</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">
              ${
                booking.taxiId
                  ? `${booking.taxiId.name} – Seats: ${booking.taxiId.seats} - ${booking.taxiId.ac ? "AC" : "Non-AC"}`
                  : "—"
              }
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Adults</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${adults}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Children</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${children}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Pickup Location</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${pickupLocation}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Date & Time</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${getDateOnly(startDate)} at ${startTime}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Message</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${message || "N/A"}</td>
          </tr>
        </table>
    
        <p style="margin-top: 15px;">Please contact the customer if needed. All bookings are recorded in the system.</p>
    
        <p>Best Regards,<br/>
        <strong>Net Lanka Travels</strong></p>
      </div>
    `;
    sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });

    // ---------------- SEND EMAIL TO USER ----------------
    const userSubject = `Booking Received - Net Lanka Travels`;
    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
        <h2 style="color: #0d203a;">Booking Received – Thank You!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for submitting your ${tourType || "tour"} booking request with <strong>Net Lanka Travels</strong>! We have received your request and will contact you shortly to confirm your booking.</p>

        <h3 style="color: #0d203a;">Your Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Tour</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.tourId?.title || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Style</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.travelStyle || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Travel Purpose</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${
              booking.purpose || "—"
            }</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Accommodation</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.accommodation || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Hotel Category</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.hotelCategory || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Vehicle</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">
              ${
                booking.taxiId
                  ? `${booking.taxiId.name} – Seats: ${booking.taxiId.seats} - ${booking.taxiId.ac ? "AC" : "Non-AC"}`
                  : "—"
              }
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Adults</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${adults}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Children</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${children}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Pickup Location</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${pickupLocation}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Pickup Date & Time</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${getDateOnly(startDate)} at ${startTime}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Additional Message</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${message || "N/A"}</td>
          </tr>
        </table>

        <p style="margin-top: 15px;">If you have any questions, please reply to this email or call us at <strong>+94 705 325 512</strong>.</p>
        <p>We look forward to making your Sri Lankan ${tourType || "tour"} unforgettable!</p>

        <p>Best Regards,<br/>
        <strong>Net Lanka Travels</strong></p>
      </div>
    `;
    sendEmail({ to: email, subject: userSubject, html: userHtml });

    // Create day-before reminder
    await createDayBeforeReminder(
      booking,
      tourType === "day" ? "Day" : "Round"
    );

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("BOOKING ERROR:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// ---------------- GET ALL BOOKINGS (ADMIN) ----------------
router.get("/", adminAuth, async (req, res) => {
  try {
    const bookings = await TourBooking.find()
      .sort({ createdAt: -1 })
      .populate("tourId", "title location days itinerary")
      .populate("taxiId", "name transmission seats luggage ac image");

    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------------- UPDATE BOOKING STATUS ----------------
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TourBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking)
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ---------------- DELETE BOOKING ----------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await TourBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
