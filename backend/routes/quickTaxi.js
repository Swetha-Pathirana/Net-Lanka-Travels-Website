const express = require("express");
const QuickTaxi = require("../models/QuickTaxi");
const QuickTaxiBooking = require("../models/QuickTaxiBooking");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../utils/mailer");

const router = express.Router();

/* ---------------- CLOUDINARY STORAGE ---------------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quick-taxi/vehicles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const parser = multer({ storage });

/* ---------------- GET ALL TAXIS ---------------- */
router.get("/taxis", async (req, res) => {
  try {
    const taxis = await QuickTaxi.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      taxis,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ---------------- CREATE TAXI ---------------- */
router.post(
  "/taxis",
  adminAuth,
  parser.single("imageFile"),
  async (req, res) => {
    try {
      const { name, transmission, seats, luggage, capacity, ac } = req.body;

      const image = req.file.path;

      const taxi = new QuickTaxi({
        name,
        transmission,
        seats,
        luggage,
        capacity,
        ac,
        image,
      });

      await taxi.save();
      res.status(201).json(taxi);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ---------------- UPDATE TAXI ---------------- */
router.put(
  "/taxis/:id",
  adminAuth,
  parser.single("imageFile"),
  async (req, res) => {
    try {
      const { name, transmission, seats, luggage, capacity, ac } = req.body;

      const updateData = {
        name,
        transmission,
        seats,
        luggage,
        capacity,
        ac,
      };

      if (req.file) {
        updateData.image = req.file.path;
      }

      const updatedTaxi = await QuickTaxi.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedTaxi) {
        return res.status(404).json({ error: "Taxi not found" });
      }

      res.json(updatedTaxi);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ---------------- DELETE TAXI ---------------- */
router.delete("/taxis/:id", adminAuth, async (req, res) => {
  try {
    const deletedTaxi = await QuickTaxi.findByIdAndDelete(req.params.id);
    if (!deletedTaxi) return res.status(404).json({ error: "Taxi not found" });

    res.json({ message: "Taxi deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   BOOKINGS
====================================================== */

/* ---------------- CREATE QUICK TAXI BOOKING (PUBLIC) ---------------- */
router.post("/bookings", async (req, res) => {
  try {
    const {
      taxiId,
      firstName,
      lastName,
      phone,
      country,
      serviceType,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      pickupTime,
      adults,
      children,
      message,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !country ||
      !pickupLocation ||
      !dropLocation ||
      !pickupDate ||
      !pickupTime
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Required fields missing" });
    }

    const booking = new QuickTaxiBooking(req.body);
    await booking.save();

    await booking.populate("taxiId");

    const formattedPickupDate = new Date(pickupDate).toLocaleDateString(
      "en-GB"
    );
    const formattedDropDate = dropDate
      ? new Date(dropDate).toLocaleDateString("en-GB")
      : "-";

    // ---------------- SEND EMAIL TO ADMIN ----------------
    const adminEmail = process.env.EMAIL_USER;
    const adminSubject = `New Quick Taxi Booking: ${booking.taxiId?.name || "Vehicle"}`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
        <h2 style="color: #0d203a;">New Quick Taxi Booking Received</h2>
        <p>Dear Admin,</p>
        <p>A new quick taxi booking has been submitted. Details are below:</p>
    
        <table style="width: 100%; border-collapse: collapse; max-width: 600px; margin-top: 10px;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Field</th>
            <th style="border: 1px solid #1a354e; padding: 8px; text-align: left;">Details</th>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Name</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Phone</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${phone}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Country</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${country}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Service Type</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${serviceType}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Vehicle</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.taxiId?.name || "—"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Pickup Location</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${pickupLocation}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Drop Location</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${dropLocation}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Pickup Date & Time</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${formattedPickupDate} at ${pickupTime}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Drop Date</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${formattedDropDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Adults</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${adults || 1}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Children</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${children || 0}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #1a354e; padding: 8px; font-weight: bold;">Members</td>
            <td style="border: 1px solid #1a354e; padding: 8px;">${booking.members || "—"}</td>
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

    res.json({ success: true, booking });
  } catch (err) {
    console.error("QuickTaxi booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- GET ALL BOOKINGS (ADMIN) ----------------
router.get("/bookings", adminAuth, async (req, res) => {
  try {
    const bookings = await QuickTaxiBooking.find()
      .sort({ createdAt: -1 })
      .populate("taxiId", "name image");

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- UPDATE BOOKING STATUS (ADMIN) ----------------
// PATCH /bookings/:id
router.patch("/bookings/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, error: "Status is required" });
    }

    const booking = await QuickTaxiBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- DELETE BOOKING (ADMIN) ----------------
router.delete("/bookings/:id", adminAuth, async (req, res) => {
  try {
    await QuickTaxiBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
