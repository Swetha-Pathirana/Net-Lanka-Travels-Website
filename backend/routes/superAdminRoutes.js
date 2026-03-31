const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const SuperAdminNotification = require("../models/SuperAdminNotification");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/mailer");

// --- Middleware: SuperAdmin only ---
const superAdminOnly = async (req, res, next) => {
  await adminAuth(req, res, async () => {
    if (req.admin.role === "superadmin") next();
    else res.status(403).json({ message: "Forbidden: SuperAdmin only" });
  });
};

// --- POST: Create a new admin ---
router.post("/admins", superAdminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });

    // Create new admin
    const newAdmin = new Admin({ name, email, password, role: "admin" });
    await newAdmin.save();

    const frontendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_WEB_URL
    : process.env.DEVELOPMENT_WEB_URL;

    // ---------------- SEND EMAIL TO NEW ADMIN ----------------
    const adminSubject = "NetLanka Travels – Your Admin Account Details";
    const adminHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
        
        <h2 style="color: #0d203a;">Welcome to NetLanka Travels</h2>
    
        <p>Hello <strong>${name}</strong>,</p>
    
        <p>
          You have been granted <strong>Admin access</strong> to the NetLanka Travels management system
          by the Super Admin.
        </p>
    
        <p><strong>Your login credentials are below:</strong></p>
    
        <table style="margin: 15px 0; font-size: 14px;">
          <tr>
            <td><strong>Email</strong></td>
            <td style="padding-left: 10px;">${email}</td>
          </tr>
          <tr>
            <td><strong>Temporary Password</strong></td>
            <td style="padding-left: 10px;">${password}</td>
          </tr>
        </table>
    
        <p style="color: #444;">
          🔐 <strong>You can change your password after logging in.</strong>
        </p>
    
        <p>
          Login here:
          <a href="${frontendUrl}/admin/login">
            ${frontendUrl}/admin/login
          </a>
        </p>
    
        <hr style="margin: 25px 0; border: none; border-top: 1px solid #eaeaea;">
    
        <p style="font-size: 13px; color: #666;">
          If you believe this access was granted by mistake, please contact the Super Admin immediately.
        </p>
    
        <p>
          Best regards,<br/>
          <strong>NetLanka Travels – Super Admin Team</strong>
        </p>
    
      </div>
    </div>
    `;
    
    await sendEmail({ to: email, subject: adminSubject, html: adminHtml });

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET all admins ---
router.get("/admins", superAdminOnly, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- PATCH: Toggle admin active/inactive ---
router.patch("/admins/:id/status", superAdminOnly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Toggle isActive
    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({
      message: `Admin ${
        admin.isActive ? "activated" : "deactivated"
      } successfully`,
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle admin status" });
  }
});

// DELETE: Remove an admin completely
// DELETE: Remove an admin completely and notify them
router.delete("/admins/:id", superAdminOnly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const adminEmail = admin.email;
    const adminName = admin.name;

    // Delete admin
    await Admin.findByIdAndDelete(req.params.id);

    // ---------------- SEND EMAIL TO DELETED ADMIN ----------------
    const subject = "Your NetLanka Travels Admin Account Has Been Deleted";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
        <h2 style="color: #0d203a;">Hello ${adminName},</h2>
        <p>This is to inform you that your admin account has been <strong>permanently deleted</strong> by the Super Admin.</p>
        <p>If you believe this was a mistake or have any questions, please contact the Super Admin immediately.</p>
        <p>Best Regards,<br/><strong>Super Admin</strong></p>
      </div>
    `;
    await sendEmail({ to: adminEmail, subject, html });

    res.json({
      message: `Admin "${adminName}" deleted successfully and notified via email`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete admin" });
  }
});

// --- POST: send notification to all admins ---
router.post("/notifications", superAdminOnly, async (req, res) => {
  try {
    const { sections, action, message, priority } = req.body;

    if (!sections || !Array.isArray(sections) || sections.length === 0)
      return res.status(400).json({ message: "Select at least one section" });

    if (!action) return res.status(400).json({ message: "Action required" });

    const admins = await Admin.find({ role: "admin" });
    if (admins.length === 0)
      return res.status(400).json({ message: "No admins found" });

    const notifications = await SuperAdminNotification.insertMany(
      admins.map((admin) => ({
        sections,
        action,
        message,
        priority: priority || "medium",
        admin: admin._id,
        superAdmin: req.admin._id,
        status: "pending",
        type: "request",
      }))
    );

    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET super admin notifications ---
router.get("/notifications", superAdminOnly, async (req, res) => {
  try {
    const notifications = await SuperAdminNotification.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a super admin notification as read
router.patch("/notifications/:id", superAdminOnly, async (req, res) => {
  try {
    const notification = await SuperAdminNotification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Not found" });

    // Mark as read for Super Admin without changing admin status
    notification.readBySuperAdmin = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a super admin notification
router.delete("/notifications/:id", superAdminOnly, async (req, res) => {
  try {
    const { superAdminOnly } = req.query;
    if (superAdminOnly === "true") {
      const deleted = await SuperAdminNotification.findByIdAndDelete(
        req.params.id
      );
      if (!deleted)
        return res.status(404).json({ message: "Notification not found" });
      return res.json({ success: true, deletedFrom: "SuperAdminNotification" });
    }

    const deleted = await SuperAdminNotification.findByIdAndDelete(
      req.params.id
    );
    if (!deleted)
      return res.status(404).json({ message: "Notification not found" });

    res.json({ success: true, deletedFrom: "SuperAdminNotification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

module.exports = router;
