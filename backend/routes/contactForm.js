const express = require("express");
const ContactForm = require("../models/ContactForm");
const adminAuth = require("../middleware/adminAuth");
const sendEmail = require("../utils/mailer");

const router = express.Router();

// ---------------- POST CONTACT FORM ----------------
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "First Name, Email, and Message are required",
      });
    }

    // Save to DB
    const newForm = new ContactForm({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await newForm.save();

    // ---------------- SEND EMAIL TO ADMIN ----------------
    const adminEmail = process.env.EMAIL_USER;
    const adminSubject = "New Contact Form Submission";

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#0d203a;">New Contact Message Received</h2>

        <table style="border-collapse: collapse; width:100%; max-width:600px;">
          <tr>
            <td style="border:1px solid #ccc; padding:8px;"><strong>Name</strong></td>
            <td style="border:1px solid #ccc; padding:8px;">
              ${firstName} ${lastName || ""}
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #ccc; padding:8px;"><strong>Email</strong></td>
            <td style="border:1px solid #ccc; padding:8px;">${email}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ccc; padding:8px;"><strong>Phone</strong></td>
            <td style="border:1px solid #ccc; padding:8px;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ccc; padding:8px;"><strong>Message</strong></td>
            <td style="border:1px solid #ccc; padding:8px;">${message}</td>
          </tr>
        </table>

        <p style="margin-top:15px;">
          This message is stored in the admin panel.
        </p>

        <p><strong>Net Lanka Travels</strong></p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    // ---------------- SEND AUTO-REPLY TO USER (OPTIONAL BUT GOOD UX) ----------------
    const userSubject = "We received your message – Net Lanka Travels";

    const userHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#0d203a;">Thank you for contacting us!</h2>

        <p>Dear <strong>${firstName}</strong>,</p>

        <p>
          Thank you for reaching out to <strong>Net Lanka Travels</strong>.
          We have received your message and our team will get back to you shortly.
        </p>

        <p><strong>Your Message:</strong></p>
        <blockquote style="border-left:4px solid #0d203a; padding-left:10px;">
          ${message}
        </blockquote>

        <p>
          If your inquiry is urgent, feel free to contact us at
          <strong>+94 705 325 512</strong>.
        </p>

        <p>Best Regards,<br/><strong>Net Lanka Travels</strong></p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: userSubject,
      html: userHtml,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("CONTACT FORM ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- GET ALL MESSAGES (ADMIN) ----------------
router.get("/", adminAuth, async (req, res) => {
  try {
    const forms = await ContactForm.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, forms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- DELETE MESSAGE ----------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await ContactForm.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
